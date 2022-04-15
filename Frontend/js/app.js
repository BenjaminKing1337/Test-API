const apiURL = "https://rest-api-assignment.herokuapp.com";


function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getTools = async () => {
  const res = await fetch(apiURL + "/api/tools");
  const tools = await res.json();

  const content = document.getElementById("content");

  let noOfTools = tools.length;

  let toolNo = getRandomArbitrary(0,noOfTools);
  // let toolNo = getRandomArbitrary(0,noOfTools-1); // when not using the random function
  
  content.innerHTML="<img style='border: 1px solid black' height='100' src='"+tools[toolNo].img + "'><br><a style='font-size: 20px; color: black;' href='"+ apiURL + tools[toolNo].uri + "' target='_blank'>" + tools[toolNo].name + "</a><br>" + tools[toolNo].description+ "<br>" +tools[toolNo].type+ "<br> $ " +tools[toolNo].price;




  // for (let i=0; i<tools.length; i ++) {

  //   content.innerHTML+=tools[i].name + tools[i].description + tools[i].type + tools[i].price + tools[i].inStock;
  // }

  // content.innerText = `"${tool.value}"`;
  // content.classList.add("fst-italic");

  // const created_at = document.getElementById('created_at');
  // created_at.innerText = `"${tool.created_at}"`;
  // created_at.classList.add("fst-italic");

  // var keys = Object.keys(tool);
  // content2.innerText = `${keys[1]}; ${tool.created_at}`;

  // console.log(kes[0] + ":" + tool.categories);
};






//get first tool at initialization
getTools();

toolsForm.addEventListener("submit", (e) => {
  //preventing default
  e.preventDefault();

  getTools();
});
