import { useEffect, useState } from 'react';
import styles from '../styles/items.module.css';
import Item from './item';
import addIcon from '../icons/plus.png';

const Items = () => {
  const [items, setItems] = useState([]);

  const loadItems = () => {
    fetch('https://test-be498-default-rtdb.firebaseio.com/.json').then((response) => {
      return response.json()
    }).then((json) => {
      if (json === null) {
        setItems([])
        return;
      }
      let items = []
      Object.keys(json).forEach((key) => {
        items.push({
          id: key,
          ...json[key]
        })
      })
      setItems(items);
    })
  }

  const handleAdd = () => {
    setItems([...items, {
      firstName: "",
      lastName: "",
      age: 0,
      isNew: true
    }])
  }

  useEffect(() => {
    loadItems();
  }, [])


  return <div className={styles.container}>
    {items?.map((item) => {
      return <Item key={item.id}
        id={item.id}
        firstName={item.firstName}
        lastName={item.lastName}
        age={item.age}
        loadData={() => loadItems()}
        isNew={item.isNew}
      ></Item>
    })}
    <img alt='add-icon' src={addIcon} className={styles.addIcon} onClick={() => handleAdd()} />
  </div>
}

export default Items;