import { Box, Stack } from "@mui/material";
import CountriesPage from "../src/Components/Countries";
import './App.css';

function App() {
  return (
    <div className="App">
      <Stack flexDirection="row" alignItems="center"  paddingTop="2rem" marginLeft={{xs: "0px", sm: "0px", md: "2rem"}} width="100%" >
          <Box marginRight="2rem">
          <img src={process.env.PUBLIC_URL + '/countries.jpeg'} alt="Globe" width="100px" height="100px"/>
          </Box>
          
          <h1 style={{ color: '#333333' }}>Countries</h1>
      </Stack>
      
      <CountriesPage/>
    </div>
  );
}

export default App;
