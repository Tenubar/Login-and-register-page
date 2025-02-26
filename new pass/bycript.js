import bcrypt from 'bcrypt';

const txt = '';
const salt = 10;

newFunction();

async function newFunction(){
   const result = await bcrypt.hash(txt, salt);
   console.log(result);
}