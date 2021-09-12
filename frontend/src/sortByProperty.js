const sortRowsByProperty = (arr, property, direction) => {
let res = arr.sort(function(a,b) { 
      var A = Object.keys(a)[0];
      var B = Object.keys(b)[0];
      if (direction === 'ascending') {
        return a[A][property] < b[B][property] ? -1 : 1;
     } else if (direction === 'descending') {
        return a[A][property] < b[B][property] ? 1 : -1;
     }
      });
return res;
      
    }; 
export default sortRowsByProperty;