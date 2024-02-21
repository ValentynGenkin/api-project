import React, { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';

import useFetch from '../hooks/useFetch';
import PopUp from './PopUp';
import { useNavigate } from 'react-router-dom';

const CreatedSchema = ({ schemaData, nav }) => {
  const [modalShow, setModalShow] = useState(false);
  const [password, setPassword] = useState(null);
  const [data, isLoading, error, fetchData] = useFetch(`api/schema/delete-api`);
  const navigation = useNavigate();

  const deleteSchema = () => {
    if (password) {
      fetchData({
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: `${password}` }),
      });
    }
  };

  useEffect(() => {
    if (data && data.success) {
      setTimeout(() => {
        navigation('/user-menu');
      }, 2000);
    }
  }, [data]);

  return (
    <>
      <p>{schemaData.schemaName}</p>
      <pre>{schemaData.schema}</pre>
      <Button
        onClick={() => {
          nav(-1);
        }}
      >
        Back
      </Button>
      <Button variant="danger" onClick={() => setModalShow(true)}>
        Delete Schema
      </Button>
      <PopUp
        response={data}
        password={setPassword}
        loading={isLoading}
        error={error}
        deleteFunc={deleteSchema}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};

export default CreatedSchema;