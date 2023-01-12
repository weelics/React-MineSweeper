const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
  

export default function createTable(length , nMine) {

    if(nMine >= length*length) nMine = length-1;

    const tmpA= new Array(length*length);
  
    for (let i = 0; i < length * length; i++) {
        tmpA[i] = {
          isVisible: false,
          value: 0,
          isBomb: false,
        };
        if(i >= 0 && i <= nMine) tmpA[i].isBomb = true;
    }
    shuffleArray(tmpA);
    const a = new Array(length);
  
    for (let i = 0; i < length; i++) {
      a[i] = new Array(length);
      for (let j = 0; j < length; j++) {
        a[i][j] = tmpA[i * length + j];
        a[i][j].key = (i *length) + j;
      }
    }
  
  
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        if (a[i][j].isBomb) {
          if (i > 0) {
            a[i - 1][j].value++;
          }
          if (i < length - 1) {
            a[i + 1][j].value++;
          }
  
          if (j > 0) {
            a[i][j - 1].value++;
          }
  
          if (j < length - 1) {
            a[i][j + 1].value++;
          }
  
          if (i > 0 && j > 0) {
            a[i - 1][j - 1].value++;
          }
  
          if (i < length - 1 && j < length - 1) {
            a[i + 1][j + 1].value++;
          }
  
          if (i > 0 && j < length - 1) {
            a[i - 1][j + 1].value++;
          }
  
          if (i < length - 1 && j > 0) {
            a[i + 1][j - 1].value++;
          }
        }
      }
    }
  
    return a;
  }