import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

const DefaultValue = ({ defaultOption, setDefaultValue }) => {
  return (
    <div style={{ width: '250px' }}>
      <InputGroup
        size="sm"
        className="mb-3"
        onChange={(e) => {
          if (defaultOption === 'Yes') {
            setDefaultValue(e.target.value);
          } else {
            setDefaultValue(null);
          }
        }}
      >
        <InputGroup.Text id="inputGroup-sizing-sm">
          Default value
        </InputGroup.Text>
        <Form.Control
          type="text"
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
        />
      </InputGroup>
      <p>You can use a boolean value (true, false) or any string or number</p>
    </div>
  );
};

export default DefaultValue;
