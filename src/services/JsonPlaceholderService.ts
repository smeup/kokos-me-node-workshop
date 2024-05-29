import {
    ExecutionContext,
    Fun,
    KokosService,
    SmeupDataStructureWriter,
    User,
    parseKeyValueBetweenBrackets,
  } from "@sme.up/kokos-sdk-node";

import axios from 'axios';
import UserT, { Image } from "interfaces/types";
  
async function fetchUsers() {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users'); 
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
}

async function fetchImages() {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/photos?albumId=1'); 
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
}

async function fetchUserById(id: string) {
  try {
    const url = 'https://jsonplaceholder.typicode.com/users?id=' + id;
    const response = await axios.get(url); 


    return response.data[0];
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
}


const JsonPlaceholderService: KokosService = {
  methods: {
    "GET.ALL": getUsers,
    "GET.USE": getUserDetail,
    "GET.IMG": getImages,
  },
};
async function getImages(
  _fun: Fun,
  _context: ExecutionContext,
  printer: SmeupDataStructureWriter
) {

  const images: Image[] = await fetchImages();


  images.forEach(image => {

    printer.writeTreeNode({
      children: [],
      content: {
        tipo: "J4",
        parametro: "IMG",
        codice: "J1;URL;" + image.url,
        testo: "",
      },
    });
  });
}

async function getUsers(
  _fun: Fun,
  _context: ExecutionContext,
  printer: SmeupDataStructureWriter
) {


  const users: UserT[] = await fetchUsers();

  printer.writeColumns([
    {
      code: "name",
      text: "Nome",
    },
    {
      code: "username",
      text: "Username",
    },
    {
      code: "email",
      text: "Email",
    },
    {
      code: "phone",
      text: "Telefono",
    },
  ]);

  users.forEach(user => {

    printer.writeRow({
      fields: {
          name: {
            name: "name",
            tooltip: false,
            smeupObject: {
              tipo: "",
              parametro: "",
              codice: user.name,
              testo: user.name,
            },
          },
          username: {
            name: "username",
            tooltip: false,
            smeupObject: {
              tipo: "",
              parametro: "",
              codice: user.username,
              testo: user.username.toUpperCase(),
            },
          },
          email: {
            name: "email",
            tooltip: false,
            smeupObject: {
              tipo: "",
              parametro: "",
              codice: user.email,
              testo: user.email,
            },
          },
          phone: {
            name: "phone",
            tooltip: false,
            smeupObject: {
              tipo: "",
              parametro: "",
              codice: user.phone,
              testo: user.phone,
            },
          },
        },
      });
  });


}



async function getUserDetail(
  _fun: Fun,
  _context: ExecutionContext,
  printer: SmeupDataStructureWriter
) {

  const inputMap: { [key: string]: string } = _fun.INPUT ? parseKeyValueBetweenBrackets(_fun.INPUT) : {};
  const userId = inputMap["USER_ID"]
  const user: UserT = await fetchUserById(userId);

  printer.writeTreeNode({
    children: [],
    content: {
      tipo: "",
      parametro: "",
      codice: "",
      testo: user['username'],
    },
  });
  

  printer.writeTreeNode({
    children: [],
    content: {
      tipo: "",
      parametro: "",
      codice: "",
      testo: user['name'],
    },
  });

}

export default JsonPlaceholderService;