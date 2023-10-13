import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import '../Styles/machineOption.css';

function MachineOption() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [oSysData, setOsData] = useState([]);
  const [formData, setFormData] = useState({
    ipAddr: '',
    portNumber: '',
    machineName: '',
    nomOS: '',
    versionOS: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(() => {
    axios
      .get(`${apiUrl}/oSys`)
      .then((response) => {
        setOsData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [apiUrl]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitting(true);

      axios
        .post(`${apiUrl}/machine_user_add/`, formData)
        .then((response) => {
          console.log('Data sent successfully', response);
        })
        .catch((error) => {
          console.error('Error sending data:', error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [apiUrl, isSubmitting, formData]);

  const nomOSOptions = useMemo(() => {
    // Create an array of unique nomOS values
    const uniqueNomOS = [...new Set(oSysData.map((item) => item.nomOS))];

    return uniqueNomOS.map((nomOSValue, index) => (
      <option key={index} value={nomOSValue}>
        {nomOSValue}
      </option>
    ));
  }, [oSysData]);

  const versionOSOptions = useMemo(() => {
    return oSysData
      .filter((item) => item.nomOS === formData.nomOS)
      .map((item) => (
        <option key={item.idOsys} value={item.versionOS}>
          {item.versionOS}
        </option>
      ));
  }, [oSysData, formData.nomOS]);

  return (
    <div className="machineOption-container">
      <div className="input-group">
        <div>
          <label htmlFor="machineNameInput">Machine Name:</label>
          <input
            type="text"
            id="machineNameInput"
            name="machineName"
            value={formData.machineName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="ipAddrInput">IP Address:</label>
          <input
            type="text"
            id="ipAddrInput"
            name="ipAddr"
            value={formData.ipAddr}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="portNumberInput">Port Number:</label>
          <input
            type="text"
            id="portNumberInput"
            name="portNumber"
            value={formData.portNumber}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div>
        <label>OS:</label>
        <select
          id="nomOSSelect"
          name="nomOS"
          value={formData.nomOS}
          onChange={handleInputChange}
          required
        >
          <option value="">Select nomOS</option>
          {nomOSOptions}
        </select>
      </div>

      <div>
        <label>Version:</label>
        <select
          id="versionOSSelect"
          name="versionOS"
          value={formData.versionOS}
          onChange={handleInputChange}
          required
        >
          <option value="">Select versionOS</option>
          {versionOSOptions}
        </select>
      </div>

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Data'}
      </button>
    </div>
  );
}

export default MachineOption;
