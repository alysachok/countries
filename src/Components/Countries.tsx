import { Box, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import { DataGrid, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';

const BASE_URL = "https://restcountries.com/v3.1"

interface Country {
  name: { common: string };
  capital: string[];
  flags: { png: string };
  population: number;
  maps: { googleMaps: string}
  languages: { [key: string]: string };
  startOfWeek: string
  continents: { [key: string]: string };
  area: number
}
const initialSortModel: GridSortModel = [];
const initialFilterModel = {
    items: [],
  };

const CountriesPage: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>(initialSortModel);
  const [filterModel, setFilterModel] = useState<GridFilterModel>(initialFilterModel);
 
  const handleResetAll = () => {
    setSortModel(initialSortModel);
    setFilterModel(initialFilterModel);
  };

  const handleResetSorting = () => {
    setSortModel(initialSortModel);
  };

  const handleResetFilters = () => {
    setFilterModel(initialFilterModel);
  };
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const countriesWithSortableLanguages = data.map((country: Country) => ({
          ...country,
          languages: Object.values(country.languages || {}).sort().join(', ')
        }));
  
        setCountries(countriesWithSortableLanguages);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    fetchData();
  }, []);

  const columns = [
    { field: 'number', headerName: 'Number', flex: 0.5, },
    { field: 'name', headerName: 'Country', flex: 1.2, },
    { 
        field: 'flag', 
        headerName: 'Flag', 
        flex: 1, 
        filterable: false,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
          <img src={params.value as string} alt="Flag" style={{ height: '30px', width: "60px" }} />
        ) 
    },    
    
    { field: 'capital', headerName: 'Capital', flex: 1 },
    { field: 'population', headerName: 'Population', flex: 1 },
    {   field: 'googleMaps',
        headerName: 'Google Maps',
        sortable: false,
        filterable: false,
        flex: 1,
        renderCell: (params: GridRenderCellParams) => (
            <a href={params.value as string} target="_blank" rel="noopener noreferrer">View on Maps</a>
        )
    },
    { 
        field: 'languages', 
        headerName: 'Languages', 
        flex: 1,
        renderCell: (params:GridRenderCellParams) => (
            <Tooltip title={params.value} enterDelay={300} leaveDelay={200}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {params.value}
              </div>
            </Tooltip>
          ),
    },
    { field: 'startOfWeek', headerName: 'Start of Week', flex: 1 },
    { 
        field: 'continents', 
        headerName: 'Continents', 
        flex: 1,
        sortable: false,
        renderCell: (params:GridRenderCellParams) => (
            <Tooltip title={params.value} enterDelay={300} leaveDelay={200}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {params.value}
              </div>
            </Tooltip>
          ),
    },
    { field: 'area', headerName: 'Area, Km²', flex: 1, },
  ];

  const rows = countries.map((country, index) => ({
    number: index+1,
    flag: country.flags?.png || 'default-flag.png',
    id: country.name.common,
    name: country.name?.common || 'Unknown',
    capital: country.capital?.[0] || 'No capital',
    population: country.population || 0,
    googleMaps: country.maps.googleMaps || "N/A",
    languages: country.languages || 0,
    startOfWeek: country.startOfWeek,
    continents: country.continents,
    area: country.area
  }));

  return (<Box width="100%">
            <Box style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem' }}>
                <Box marginRight="0.5rem">
                    <Button onClick={handleResetSorting} variant="contained">Reset Sorting</Button>
                </Box>
                    <Button onClick={handleResetFilters} variant="contained">Reset Filters</Button>
                <Box marginLeft="0.5rem">
                    <Button onClick={handleResetAll} variant="contained">Reset All</Button>
                </Box>
            </Box>
            
            <Box sx={{
            height: '100%', 
            width: "auto", 
            maxWidth: "100%",
            margin: { xs: "0px", sm: "0px", md: '1rem' }, 
            padding: '0', 
            overflow: 'hidden',
            backgroundColor: "white"
        }}>
                <DataGrid
                rows={rows}
                columns={columns}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
                filterModel={filterModel}
                onFilterModelChange={(newModel) => setFilterModel(newModel)}
                />
            </Box>
  </Box>
  
  );
};

export default CountriesPage;
