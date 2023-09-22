import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

function MachineOption() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [oSysData, setOsData] = useState([]);
  const [formData, setFormData] = useState({
    ipAddr: '',
    portNumber: '',
    machineName: '',
  });
  const [selectedNomOS, setSelectedNomOS] = useState('');
  const [selectedVersionOS, setSelectedVersionOS] = useState('');
  const [manualNomOS, setManualNomOS] = useState('');
  const [manualVersionOS, setManualVersionOS] = useState('');
  const [useManualEntry, setUseManualEntry] = useState(false);
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

  const nomOSOptions = useMemo(() => {
    return oSysData.map((item) => (
      <option key={item.idOsys} value={item.nomOS}>
        {item.nomOS}
      </option>
    ));
  }, [oSysData]);

  const versionOSOptions = useMemo(() => {
    return oSysData
      .filter((item) => item.nomOS === selectedNomOS)
      .map((item) => (
        <option key={item.idOsys} value={item.versionOS}>
          {item.versionOS}
        </option>
      ));
  }, [oSysData, selectedNomOS]);

  const handleToggleMode = useCallback(() => {
    setUseManualEntry(!useManualEntry);
  }, [useManualEntry]);

  const handleSubmit = useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitting(true);

      const dataToSend = {
        ipAddr: formData.ipAddr,
        portNumber: formData.portNumber,
        machineName: formData.machineName,
        nomOS: useManualEntry ? manualNomOS : selectedNomOS,
        versionOS: useManualEntry ? manualVersionOS : selectedVersionOS,
      };

      axios
        .post(`${apiUrl}/your-endpoint`, dataToSend)
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
  }, [
    apiUrl,
    isSubmitting,
    formData,
    useManualEntry,
    manualNomOS,
    manualVersionOS,
    selectedNomOS,
    selectedVersionOS,
  ]);

  return (
    <div>
      <div>
        <label htmlFor="machineNameInput">Machine Name:</label>
        <input
          type="text"
          id="machineNameInput"
          name="machineName"
          value={formData.machineName}
          onChange={handleInputChange}
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
        />
      </div>

      {/* OS SELECTION */}
      <button onClick={handleToggleMode}>
        {useManualEntry ? 'Use Dropdown' : 'Use Manual Entry'}
      </button>

      {useManualEntry ? (
        <div>
          <div>
            <label htmlFor="manualNomOSInput">Enter nomOS manually:</label>
            <input
              type="text"
              id="manualNomOSInput"
              name="manualNomOS"
              value={manualNomOS}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="manualVersionOSInput">Enter versionOS manually:</label>
            <input
              type="text"
              id="manualVersionOSInput"
              name="manualVersionOS"
              value={manualVersionOS}
              onChange={handleInputChange}
            />
          </div>
        </div>
      ) : (
        <div>
          <label>Select nomOS:</label>
          <select
            id="nomOSSelect"
            value={selectedNomOS}
            onChange={(e) => setSelectedNomOS(e.target.value)}
          >
            <option value="">Select nomOS</option>
            {nomOSOptions}
          </select>

          <label>Select versionOS:</label>
          <select
            id="versionOSSelect"
            value={selectedVersionOS}
            onChange={(e) => setSelectedVersionOS(e.target.value)}
          >
            <option value="">Select versionOS</option>
            {versionOSOptions}
          </select>
        </div>
      )}

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Data'}
      </button>
    </div>
  );
}

export default MachineOption;
