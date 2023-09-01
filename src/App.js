import { useEffect, useState } from 'react';
import './App.css';
import jsonWineData from './Wine-Data.json'


function App() {

  // Using state for new data set having gamma property
  const [gammaDataSet, setGammaDataset] = useState(jsonWineData);

  useEffect(() => {
    // adding "Gamma" property to the jsonWineData Object
    const datasetIncluingGamma = gammaDataSet.map( obj => ({...obj, Gamma: Number(obj.Ash)*Number(obj.Hue)/Number(obj.Magnesium)}))
    setGammaDataset(
      datasetIncluingGamma
    )
  },[])

  return (
    <>
      {/* 
        I have created such a solution where  different ingredients can be choosen for analysis without breaking the functionality.
        This functionality can also be extended to add more classes in the data set and new Classes columns would be added automatically. - For now it only works with 3 classes ;-)
      */}

      <h1>Wine Data Visualisation</h1>
      <Table data={jsonWineData} ingredient='Flavanoids'/>  {/* Used the jsonWineData dataset as is */}
      <br/>
      <Table data={gammaDataSet} ingredient='Gamma'/>       {/* Using new gammaDataSet having "Gamma" property added. */}

      <CreatorInfo/>
    </>
  );
}

export default App;

function Table({data, ingredient}) {

  // Func
  const meanValues = calculateMean(data, ingredient);
  const medianValues = calculateMedian(data, ingredient);
  const modeValues = calculateMode(data, ingredient);

  const columnsHeaders = [
    { header: 'Measure', key: 'measure' },
    { header: 'Class 1', key: 'class1' },
    { header: 'Class 2', key: 'class2' },
    { header: 'Class 3', key: 'class3' }
  ]

  const tableData = [
    { measure: `${ingredient} Mean`, class1Mean: meanValues[0], class2Mean: meanValues[1], class3Mean: meanValues[2] },
    { measure: `${ingredient} Median`, class1Median: medianValues[0], class2Median: medianValues[1], class3Median: medianValues[2] },
    { measure: `${ingredient} Mode`, class1Mode: modeValues[0], class2Mode: modeValues[1], class3Mode: modeValues[2] },
  ]


/* Functions for calculating Mean, Median and Mode */

  function calculateMean(data, ingredient){
    const alcohalClass = new Set();
    const filteredClasses = data.filter( item => {
      if(alcohalClass.has(item.Alcohol)){
        return false
      }
      alcohalClass.add(item.Alcohol)
      return true
    })
  
    let uniqueClasses = Array.from(alcohalClass)
  
    let classWiseMean = uniqueClasses.map( uniqueClass => {
      const classWiseObjects = data.filter( obj => obj.Alcohol === uniqueClass);
      const classWiseSumOfFlavanoids = classWiseObjects.reduce((a,c) => a + Number(c[`${ingredient}`]),0);
      const totalValues = classWiseObjects.length
      const roundOffValue = Math.round(classWiseSumOfFlavanoids/totalValues * 1000) / 1000 
      return roundOffValue
    })
    return classWiseMean;
  }

  function calculateMedian(data, ingredient){
    const alcohalClass = new Set();
    const filteredClasses = data.filter( item => {
      if(alcohalClass.has(item.Alcohol)){
        return false
      }
      alcohalClass.add(item.Alcohol)
      return true
    })
  
    let uniqueClasses = Array.from(alcohalClass)
  
    let classWiseMedian = uniqueClasses.map( uniqueClass => {
      const classWiseObjects = data.filter( obj => obj.Alcohol === uniqueClass)
      const flavanoidsArray = classWiseObjects.map( item => Number(item[`${ingredient}`]));
      const flavanoidsSortedArray = flavanoidsArray.sort((a,b) => Number(a) - Number(b))
      const middleIndex = Math.round(flavanoidsSortedArray.length / 2)

      if(flavanoidsSortedArray.length % 2 !== 0){
        return Math.round((flavanoidsSortedArray[middleIndex]) * 1000) / 1000
      } else {
        return Math.round(((flavanoidsSortedArray[middleIndex - 1] + flavanoidsSortedArray[middleIndex])/2) * 1000) / 1000;
      }

    })
    return classWiseMedian;
  }
  
  function calculateMode(data, ingredient){
    const alcohalClass = new Set();
    const filteredClasses = data.filter( item => {
      if(alcohalClass.has(item.Alcohol)){
        return false
      }
      alcohalClass.add(item.Alcohol)
      return true
    })
  
    let uniqueClasses = Array.from(alcohalClass)
  
    let classWiseMode = uniqueClasses.map( uniqueClass => {
      const classWiseObjects = data.filter( obj => obj.Alcohol === uniqueClass)
      const flavanoidsArray = classWiseObjects.map( item => Number(item[`${ingredient}`]));
      const frequncyMap = {}
      for(const num of flavanoidsArray){
        frequncyMap[num] = (frequncyMap[num] || 0) + 1;
      }
      let mode, maxFrequency = 0;

      // Find Number with Highest Frequency
      for(const num in frequncyMap){
        if(frequncyMap[num] > maxFrequency){
          mode = num;
          maxFrequency = frequncyMap[num]
        }
      }
      return Math.round(mode * 1000) / 1000;

    })
    return classWiseMode;
  }

  // Rendering Component Below

  return (
    <table>
      <thead>
        <tr>
          {columnsHeaders.map(header => <th key={header.key}>{header.header}</th>)}
        </tr>
      </thead>
      <tbody>
        {
          tableData.map((row, ind) => (
            <tr key={row.measure}>
              <th>{row.measure}</th>
              { row.measure === `${ingredient} Mean` ? 
              <>
                <td>{row.class1Mean}</td> 
                <td>{row.class2Mean}</td> 
                <td>{row.class3Mean}</td> 
              </>              
              : null }
              { row.measure === `${ingredient} Median` ? 
              <>
                <td>{row.class1Median}</td> 
                <td>{row.class2Median}</td> 
                <td>{row.class3Median}</td> 
              </>              
              : null }
              { row.measure === `${ingredient} Mode` ? 
              <>
                <td>{row.class1Mode}</td> 
                <td>{row.class2Mode}</td> 
                <td>{row.class3Mode}</td> 
              </>              
              : null }
            </tr>
          ))
        }
      </tbody>
    </table >
  )
}

function CreatorInfo(){
  return(
    <>
      <hr/>
      <h4>Created By: Lokesh Kumar</h4>
      <p><a href="https://github.com/Neolokeshkr/ManufacAnalytics-DataVisualisationChallange/tree/master">See Code</a></p>
    </>
  )
}