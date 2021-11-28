import axios from 'axios';

axios
  .get('https://jsonplaceholder.typicode.com/photos')
  .then((response) => console.log(response.data));
