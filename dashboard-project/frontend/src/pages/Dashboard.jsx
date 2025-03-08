import React, { useState, useEffect } from "react";
import { getGoogleSheetData } from "../api/getGoogleSheetData";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styles from "../style";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const socket = io("http://localhost:5000");

const Dashboard = () => {
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([
        { name: "ID", type: "Text", isDynamic: false },
        { name: "Name", type: "Text", isDynamic: false },
        { name: "Role", type: "Text", isDynamic: false },
        { name: "Date", type: "Date", isDynamic: false }
    ]);

    useEffect(() => {
        fetchData(); // Initial Fetch
    
        socket.on("sheetData", async (newSheetData) => {
            console.log("🔄 Received Google Sheet Data:", newSheetData);
    
            // Fetch the latest MongoDB data
            const mongoData = await fetchDynamicData();
            
            // Merge the new sheet data with MongoDB data
            const mergedData = newSheetData.map((row, rowIndex) => ({
                ...row,
                ...(mongoData[rowIndex] || {}), // Preserve MongoDB data if exists
            }));
    
            console.log("🔄 Updated Table Data after Socket Update:", mergedData);
            setTableData(mergedData);
        });
    
        return () => {
            socket.off("sheetData");
        };
    }, []);    
    

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const savedColumns = JSON.parse(localStorage.getItem("customColumns"));
        if (savedColumns) setColumns([...columns, ...savedColumns]);
    
        fetchData(); // Fetch Google Sheets and MongoDB data together
    }, []);
    
    const fetchDynamicData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/getDynamicData");
            const data = await response.json();
            console.log("MongoDB Data:", data); // ✅ Debugging log
    
            // Convert MongoDB data into an index-based map
            const mongoData = {};
            data.forEach(item => {
                if (!mongoData[item.rowIndex]) mongoData[item.rowIndex] = {};
                mongoData[item.rowIndex][item.colName] = item.value;
            });
    
            console.log("Processed MongoDB Data:", mongoData); // ✅ Debugging log
            return mongoData; // ✅ Now returning the data instead of setting state
        } catch (error) {
            console.error("Error fetching dynamic data:", error);
            return {}; // Return an empty object in case of an error
        }
    };
    
    const fetchData = async () => {
        try {
            const sheetData = await getGoogleSheetData();
            console.log("Google Sheets Data:", sheetData); // Debugging
    
            const mongoData = await fetchDynamicData(); // ✅ Now properly retrieving MongoDB data
    
            // Merge Google Sheets data with MongoDB data
            const mergedData = sheetData.map((row, rowIndex) => ({
                ...row,
                ...(mongoData[rowIndex] || {}), // ✅ Merge MongoDB data if it exists
            }));
    
            console.log("Merged Data:", mergedData); // ✅ Debugging log
            setTableData(mergedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    


    const addColumn = (type = "Text") => {
        const newColumnName = prompt("Enter column name:");
        if (newColumnName) {
            const newColumn = { name: newColumnName, type, isDynamic: true };
            const updatedColumns = [...columns, newColumn];
            setColumns(updatedColumns);
            localStorage.setItem("customColumns", JSON.stringify(updatedColumns.filter(col => col.isDynamic)));
        }
    };

    const deleteColumn = (colName) => {
        const updatedColumns = columns.filter(col => col.name !== colName || !col.isDynamic);
        setColumns(updatedColumns);
        localStorage.setItem("customColumns", JSON.stringify(updatedColumns.filter(col => col.isDynamic)));
    };

    const handleChange = async (rowIndex, colName, value) => {
      const column = columns.find(col => col.name === colName);
      if (!column?.isDynamic) return; // Only modify dynamic columns
  
      setTableData(prevData => {
          const updatedData = [...prevData];
          updatedData[rowIndex] = { ...updatedData[rowIndex], [colName]: value };
          return updatedData;
      });
  
      // Send the updated value to the backend
      try {
          await fetch("http://localhost:5000/api/saveDynamicData", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ rowIndex, colName, value })
          });
      } catch (error) {
          console.error("Error saving data:", error);
      }
  };  

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className={`${styles.padding} bg-primary min-h-screen`}>
          <div className="flex justify-between items-center mb-8 py-4 border-b-2 border-gray-300">
            <h2 className={`${styles.heading2} text-white`}>Dashboard</h2>
            <div className="flex items-center">
              <span className="mr-4 text-lg font-bold text-white">Welcome, {user?.name || "User"}</span>
              <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded-lg">Logout</button>
            </div>
          </div>
    
          <div className="mb-4">
            <button className="bg-green-500 text-white py-2 px-4 mr-4 rounded-lg" onClick={() => addColumn("Text")}>Add Text Column</button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg" onClick={() => addColumn("Date")}>Add Date Column</button>
          </div>
    
          <table className="w-full border-collapse mt-4 bg-[#1e1f2a] bg-opacity-75 backdrop-blur-lg rounded-lg shadow-lg">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className="bg-[#1e1f2a] text-white p-4 text-center border-b-2 border-gray-300 relative rounded-t-lg">
                    {col.name}
                    {col.isDynamic && (
                      <button onClick={() => deleteColumn(col.name)} className="absolute top-2 right-2 text-red-600 bg-transparent py-1 px-2 rounded-full text-xs hover:bg-red-700 hover:text-white transition duration-200 ease-in-out">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-300">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="p-4 text-gray-300 text-center">
                      {col.isDynamic ? (
                        col.type === "Date" ? (
                          <input
                            type="date"
                            defaultValue={row[col.name] ? new Date(row[col.name]).toISOString().split("T")[0] : ""}
                            onChange={(e) => handleChange(rowIndex, col.name, e.target.value)}
                            className="w-full p-2 text-gray-300 bg-transparent rounded-lg text-center"
                          />
                        ) : (
                          <input
                            type="text"
                            value={row[col.name] || ""}
                            onChange={(e) => handleChange(rowIndex, col.name, e.target.value)}
                            className="w-full p-2 text-gray-300 bg-transparent rounded-lg text-center"
                          />
                        )
                      ) : (
                        <span>{row[col.name] || ""}</span> // Completely read-only for non-dynamic columns
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
};

export default Dashboard;
