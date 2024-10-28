import {React,/* useContext, useEffect, useState*/} from 'react';

import Ingredients from './Ingredients'; 

function decodeBatch(body){
  // if (body === undefined) {
  //   return {
  //     yeasts:[], malt:[], hops:[]
  //   }
  // }
  const recipe = body; 

  const nameAmount = n => n;
  /*(n !== undefined) 
    ? Object.entries(n).map(e => ({ 
        name :e[1].name,
        amount :e[1].amount
    }))
    : [];
*/
return recipe;
  // return {
  //     litres: recipe?.litres,
  //     name: recipe?.name,
  //     abv : recipe?.abv,
  //     fermentables : recipe?.data?.mashFermentables,
  //     hops : recipe?.hops,
  //     miscs: recipe?.miscs,
  //     yeasts: recipe?.yeasts
  // }
}

function Brewfather(props) {  
  const batch = props.batch;
  
  const recipe = decodeBatch(batch);
      
  return (<Ingredients fermentables={recipe.fermentables} hops={recipe.hops} yeasts={recipe.yeasts}/>)
}

export default Brewfather;
