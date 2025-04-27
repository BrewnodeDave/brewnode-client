async function getBrewdata(name, since) {
    try {
        const encodedSince = encodeURIComponent(since);
        
        const result = await mySQLgetBrewData(name, (since === '') ? undefined : encodedSince);
        result.latestTimestamp = result.latestTimestamp ? result.latestTimestamp : '';

        return result;
    } catch (error) {
        return { err: error.message || error };
    }
}

/**
 * Sanitizes a brew name by replacing any character that is not a letter, number, or underscore with an underscore.
 * Ensures the name starts with a letter or underscore and truncates the result to 64 characters.
 *
 * @param {string} brewname - The brew name to sanitize.
 * @returns {string} - The sanitized brew name.
 */
function sanitizeBrewName(brewname) {
    let sanitized = brewname.replace(/[^a-zA-Z0-9_]/g, '_');
    if (!/^[a-zA-Z_]/.test(sanitized)) {
        sanitized = '_' + sanitized;
    }
    return sanitized.substring(0, 64);
}

async function mySQLgetBrewData(name, since = '1970-01-01') {
// async function mySQLgetBrewData(name, since = '1970-01-01 00:00:00') {
	const TIME_ZONE_OFFSET = 0;
    const tablename = sanitizeBrewName(name);

    const url = `https://brewnode.co.uk/php/index.php?cmd=getBrewData&name=${tablename}&since=${since}`;
    
    try {
        return await fetch(url, { 
            method: 'GET', 
            headers: { 'Content-Type': 'application/json' } 
        })
        .then(response => response.json())
        .then(brew => {
            // Transform the results into a series of arrays
            const timeSeries = [];
            let latestTimestamp = null;
            brew.forEach(row => {
                const name = row.name;
                const timestamp = new Date(row.timestamp); // Convert MySQL TIMESTAMP to JavaScript Date
                timestamp.setHours(timestamp.getHours() + TIME_ZONE_OFFSET);

                timeSeries[name] = timeSeries[name] ? timeSeries[name] : [];
                timeSeries[name].push({
                    value: JSON.parse(row.value),
                    timestamp
                });

                if (!latestTimestamp || timestamp > latestTimestamp) {
                    latestTimestamp = timestamp;
                }
            });
            
            // Get key and value of each object in timeSeries
            const highcharts = Object.entries(timeSeries).map(([key, value]) => ({
                name: key,
                data: value.map(({value, timestamp}) => ([timestamp, value]))
            }));
            
            const result = { highcharts, latestTimestamp };
            return result;
        ;})
    } catch (error) {
    throw new Error(`Network error: ${error.message || error}`);
  }
}

async function getBrewnames() {
    const url = `https://brewnode.co.uk/php/index.php?cmd=brewnames`;
    try {
        const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error.message || error);
    }
}

// async function getBrewdata(brewname) {
//     const url = `https://brewnode.co.uk/php/index.php?cmd=brewdata&brew=${brewname}`
//     try {
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: { 'Content-Type': 'application/json' },
//             mode: 'cors'
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const brew = await response.json();
//         console.log(JSON.stringify(brew));
//     } catch (error) {
//         console.error('Error fetching data:', error.message || error);
//     }
// }

module.exports = {
    getBrewnames,
    getBrewdata
}