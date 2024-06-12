import {
    ExecutionContext,
    Fun,
    KokosService,
    SmeupDataNode,
    SmeupDataStructureWriter,    
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
    let node: SmeupDataNode = {
      children: [],
      cells: {
        url: {
          value: "",
          obj: {
            t: "J4",
            p: "IMG",
            k: "J1;URL;" + image.url,
          },
        }
      },
      value: ""
    };

    printer.writeDataNode(node);
  });
}

async function getUsers(
  _fun: Fun,
  _context: ExecutionContext,
  printer: SmeupDataStructureWriter
) {


  const users: UserT[] = await fetchUsers();


  printer.writeDataColumns([
    {
      name: "id",
      title: "Id",
    },
    {
      name: "name",
      title: "Nome",
    },
    {
      name: "username",
      title: "Username",
    },
    {
      name: "email",
      title: "Email",
    },
    {
      name: "phone",
      title: "Telefono",
    },
  ]);

  users.forEach(user => {

    printer.writeDataRow({
      cells: {
        id: {
          value: user.id.toString(),
        },
          name: {
            value: user.name,
          },
          username: {
            value: user.username ?? "",
          },
          email: {
            value: user.email,
          },
          phone: {
            value: user.phone,
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

  if(userId !== undefined) {
    const user: UserT = await fetchUserById(userId);

    printer.writeDataNode({
      children: [],
      value: user['username'] ?? "",
      obj: {
        t: "",
        p: "",
        k: user['username'] ?? "",
      },
    });

    printer.writeDataNode({
      children: [
          {
            children: [],
            value: user['address'].street ?? "",
        },
        {
          children: [],
          value: user['address'].city ?? "",
      }
      ],
      value: "Address",
    });
    

  printer.writeDataNode({
      children: [],
      value: user['name'] ?? "",
    });

  printer.writeDataNode({
    children: [],
    value: user['phone'] ?? "",
  });

  printer.writeDataNode({
    children: [
      {
        children: [],
        value: user['company'].name ?? "",
    },
  ],
    value: "Company",
  });

  }
}

export default JsonPlaceholderService;