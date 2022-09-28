import { useState } from 'react';
import styles from './container.module.css';
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import loadingIcon from '../icons/loading-icon.gif';

const Container = () => {
  const allowedExtensions = ["csv"];
  const [isLoad0, setIsLoad0] = useState(false);
  const [isLoad1, setIsLoad1] = useState(false);
  const [isLoaded0, setIsLoaded0] = useState(false);
  const [isLoaded1, setIsLoaded1] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [data0, setData0] = useState([]);
  const [data1, setData1] = useState([]);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    setIsLoaded0(false);
    setIsLoaded1(false);
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        setIsError(true);
        return;
      }

      setFile(inputFile);
      setFileName(inputFile.name);
    }
  };


  const handleParse0 = () => {
    setIsLoad0(true);
    if (!file) {
      setError("Enter a valid file");
      setIsError(true);
      setIsLoad0(false);
      return
    }

    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: false });
      const parsedData = csv?.data;
      let dataArray = [];
      parsedData.forEach((row) => {
        if (row[0] === '') return
        dataArray.push({
          id: row[0],
          area: row[1],
          nameOfProduct: row[2],
          quantity: row[3],
          brand: row[4],
        })
      });

      let resultObj = {};
      dataArray.map((obj, index) => {
        return (
          resultObj[obj.nameOfProduct] = (parseInt(obj.quantity) +
            (resultObj[obj.nameOfProduct] !== undefined ?
              parseInt(resultObj[obj.nameOfProduct]) : 0))
        )
      });

      let data = [];
      Object.keys(resultObj).forEach((key) => {
        data.push([key, resultObj[key] / dataArray.length])
      })
      setIsError(false);
      setData0(data);
    };
    reader.readAsText(file);
    setTimeout(() => {
      setIsLoad0(false);
      setIsLoaded0(true);
    }, 1200)
  }

  const mostPopularBrand = (brandsList) => {
    return Object.entries(
      brandsList?.reduce((a, v) => {
        a[v] = a[v] ? a[v] + 1 : 1;
        return a;
      }, {})
    )?.reduce((a, v) => (v[1] >= a[1] ? v : a), [null, 0])[0];
  }

  const handleParse1 = () => {
    setIsLoad1(true);
    if (!file) {
      setError("Enter a valid file");
      setIsError(true);
      setIsLoad0(false);
      return
    }

    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: false });
      const parsedData = csv?.data;
      let dataArray = [];
      parsedData.forEach((row) => {
        if (row[0] === '') return
        dataArray.push({
          id: row[0],
          area: row[1],
          nameOfProduct: row[2],
          quantity: row[3],
          brand: row[4],
        })
      });

      let resultObj = {};
      dataArray.map((obj, index) => {
        return (
          resultObj[obj.nameOfProduct] = ((resultObj[obj.nameOfProduct] !== undefined ? resultObj[obj.nameOfProduct] + ',' : '') +
            obj.brand).split(",")
        )
      });

      let data = [];
      Object.keys(resultObj).map((key) => {
        return data.push([key, mostPopularBrand(resultObj[key])])
      })

      setIsError(false);
      setData1(data);
    };
    reader.readAsText(file);
    setTimeout(() => {
      setIsLoad1(false);
      setIsLoaded1(true);
    }, 1200)
  }

  return (
    <div className={styles.container}>
      <label>
        <input type="file" id="file" aria-label="File browser example" accept='.csv'
          onChange={handleFileChange} />
      </label>
      <div style={{ 'display': 'flex' }}>
        {isLoaded0 ? <CSVLink
          data={data0}
          filename={"0_" + fileName}
          className={`${styles.button} ${styles.download}`}
          target="_blank"
        >
          Download 0_CSV File
        </CSVLink> :
          <button
            className={styles.button}
            onClick={handleParse0}>
            {isLoad0 ? <img alt="icon" src={loadingIcon} className={styles.icon} /> : 'Genrate 0_CSV File'}</button>
        }
        {isLoaded1 ? <CSVLink
          data={data1}
          filename={"1_" + fileName}
          className={`${styles.button} ${styles.download}`}
          target="_blank"
        >
          Download 1_CSV File
        </CSVLink> :
          <button
            className={styles.button}
            onClick={handleParse1}>
            {isLoad1 ? <img alt="icon" src={loadingIcon} className={styles.icon} /> : 'Genrate 1_CSV File'}</button>
        }
      </div>
      {isError && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}

export default Container;