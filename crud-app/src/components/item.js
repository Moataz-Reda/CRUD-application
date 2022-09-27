import styles from '../styles/item.module.css';
import deleteIcon from '../icons/delete.png';
import editIcon from '../icons/edit.png';
import cancelIcon from '../icons/multiply.png';
import confirmIcon from '../icons/check.png';
import { useState } from 'react';

const Item = (props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [firstName, setFirstName] = useState(props.firstName);
  const [lastName, setLastName] = useState(props.lastName);
  const [age, setAge] = useState(props.age);
  const [isNew, setIsNew] = useState(props.isNew);

  const handleEdit = () => {
    let itemObject = {
      firstName: firstName,
      lastName: lastName,
      age: age
    }

    fetch(`https://test-be498-default-rtdb.firebaseio.com/${props.id}.json`, {
      method: 'PUT',
      body: JSON.stringify(itemObject)
    }).then((response) => {
      return response.json();
    }).then(() => {
      setIsEdit(false);
      props.loadData();
    })
  }

  const handleAddRequest = () => {
    let itemObject = {
      firstName: firstName,
      lastName: lastName,
      age: age
    }

    fetch(`https://test-be498-default-rtdb.firebaseio.com/.json`, {
      method: 'POST',
      body: JSON.stringify(itemObject)
    }).then((response) => {
      return response.json();
    }).then(() => {
      setIsEdit(false);
      props.loadData();
    })
  }

  const handleDelete = () => {
    fetch(`https://test-be498-default-rtdb.firebaseio.com/${props.id}.json`, {
      method: 'DELETE'
    }).then((response) => {
      return response.json();
    }).then(() => {
      props.loadData();
    })
  }

  const handleCancel = () => {
    setFirstName(props.firstName);
    setLastName(props.lastName);
    setAge(props.age);
    setIsEdit(false);
    setIsNew(false);
    props.loadData();
  }

  return (
    <div className={styles.itemContainer}>
      {!isNew && <>
        <img alt="delete-icon" src={deleteIcon} className={styles.deleteIcon} onClick={() => handleDelete()} />
        <img alt="edit-icon" src={editIcon} className={styles.editIcon} onClick={() => setIsEdit(true)} />
      </>}
      {isEdit || isNew ?
        <input value={firstName} type="text" placeholder='First Name'
          onChange={(e) => setFirstName(e.target.value)} /> :
        <span>{firstName}</span>
      }
      {isEdit || isNew ?
        <input value={lastName} type="text" placeholder='Last Name'
          onChange={(e) => setLastName(e.target.value)} /> :
        <span>{lastName}</span>
      }
      {isEdit || isNew ?
        <input value={age} type="number"
          min="0"
          onChange={(e) => setAge(e.target.value)} /> :
        <span>{age}</span>
      }
      {(isEdit || isNew) && <div style={{ 'display': 'flex', 'justifyContent': 'center' }}>
        <img alt="confirm-icon" src={confirmIcon} className={styles.confirmIcon}
          onClick={() => isNew ? handleAddRequest() : handleEdit()} />
        <img alt="cancel-icon" src={cancelIcon} className={styles.cancelIcon}
          onClick={() => handleCancel()} />
      </div>}
    </div>
  )
}

export default Item;