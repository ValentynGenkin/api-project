import React, { useEffect, useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import RequiredSelect from './RequiredSelect';
import UniqSelect from './UniqSelect';
import DefaultSelect from './DefaultSelect';
import TypeSelect from './TypeSelect';
import camelCase from 'camelcase';
import { removeLastComma } from '../../util/removeLastComma';

const SchemaObj = ({ setSchemaObj }) => {
  const [objOption, setObjOption] = useState(null);

  const [objName, setObjName] = useState(null);

  const [minLength, setMinLength] = useState(null);
  const [maxLength, setMaxLength] = useState(null);

  const [minNumValue, setMinNumValue] = useState(null);
  const [maxNumValue, setMaxNumValue] = useState(null);
  const [minNumLength, setMinNumLength] = useState(null);
  const [maxNumLength, setMaxNumLength] = useState(null);

  const [required, setRequired] = useState(null);

  const [uniq, setUniq] = useState(null);

  const [defaultValue, setDefaultValue] = useState(null);

  const [defaultOption, setDefaultOption] = useState(null);

  const [objectsArray, setObjectsArray] = useState([]);

  const [arrayObjects, setArrayObjects] = useState([]);

  useEffect(() => {
    let data;
    if (objOption === 'Number' || objOption === 'String') {
      data = `{
       "type": "${objOption}"
      ${required === 'True' ? ',"required": true' : ''}
      ${uniq === 'True' ? ',"uniq": true' : ''}
      ${
        objOption === 'String' && minLength
          ? `,"minlength": [${minLength}]`
          : ''
      }
      ${
        objOption === 'String' && maxLength
          ? `,"maxlength": [${maxLength}]`
          : ''
      }
      ${
        objOption === 'Number' && maxNumLength
          ? `,"maxlength": [${maxNumLength}]`
          : ''
      }
      ${
        objOption === 'Number' && minNumLength
          ? `,"minlength": [${minNumLength}]`
          : ''
      }
      ${objOption === 'Number' && minNumValue ? `,"min": [${minNumValue}]` : ''}
      ${objOption === 'Number' && maxNumValue ? `,"max": [${maxNumValue}]` : ''}
      ${defaultOption === 'Yes' ? `,"default" : "${defaultValue}"` : ''}
},`;
    }

    if (objOption === 'Boolean') {
      data = `{
        "type": "${objOption}"
        ${required === 'True' ? ',"required": true' : ''}
        ${defaultOption === 'Yes' ? `,"default" : "${defaultValue}"` : ''}
      },`;
    }

    if (objOption === 'Date') {
      data = `{
        "type": "${objOption}"
        ${required === 'True' ? ',"required": true' : ''}
        ${defaultOption === 'Yes' ? `,"default" : "${defaultValue}"` : ''}
      },`;
    }

    if (objOption === 'Object') {
      data = `{${removeLastComma(objectsArray.join(' '))}},`;
    }

    if (objOption === 'Array') {
      data = `[${
        typeof arrayObjects === 'string'
          ? arrayObjects
          : `{${removeLastComma(arrayObjects.join(' '))}}`
      }],`;
    }
    if (objName && data) setSchemaObj(`${objName} ${data}`);
  }, [
    maxLength,
    maxNumLength,
    maxNumValue,
    minLength,
    minNumLength,
    minNumValue,
    objOption,
    objName,
    required,
    uniq,
    defaultValue,
    objectsArray,
    defaultOption,
    arrayObjects,
  ]);

  return (
    <div>
      {`{`}
      <div>
        <div className="schema-object-name">
          <InputGroup
            size="sm"
            className="mb-3"
            onChange={(e) => {
              const name = e.target.value;
              setObjName(`"${camelCase(name)}":`);
            }}
          >
            <InputGroup.Text id="inputGroup-sizing-sm">
              Object name
            </InputGroup.Text>
            <Form.Control
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
            />
          </InputGroup>
          <span>{`: {`}</span>
        </div>
        <div className="schema-select-block">
          <TypeSelect
            objOption={objOption}
            setObjOption={setObjOption}
            setMaxLength={setMaxLength}
            setMinLength={setMinLength}
            setMaxNumLength={setMaxNumLength}
            setMinNumLength={setMinNumLength}
            setMaxNumValue={setMaxNumValue}
            setMinNumValue={setMinNumValue}
            objectsArray={objectsArray}
            setObjectsArray={setObjectsArray}
            arrayObjects={arrayObjects}
            setArrayObjects={setArrayObjects}
          />

          {objOption === 'Object' ||
          objOption === 'Array' ||
          !objOption ? null : (
            <>
              <RequiredSelect props={setRequired} />
              {objOption === 'Boolean' || objOption === 'Date' ? null : (
                <UniqSelect props={setUniq} />
              )}
              <DefaultSelect
                setDefaultValue={setDefaultValue}
                defaultOption={defaultOption}
                setDefaultOption={setDefaultOption}
              />
            </>
          )}
          {`},`}
        </div>
      </div>
      <br />
      {`}`}
      <br />
    </div>
  );
};

export default SchemaObj;
