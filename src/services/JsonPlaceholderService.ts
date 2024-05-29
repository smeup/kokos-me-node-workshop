import {
    ExecutionContext,
    Fun,
    KokosService,
    SmeupDataStructureWriter,
    User,
  } from "@sme.up/kokos-sdk-node";

import axios from 'axios';
  
async function fetchUsers() {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users?id=1'); 
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
}

const JsonPlaceholderService: KokosService = {
  methods: {
    "GET.USE": getUsers,
  },
};

async function getUsers(
  _fun: Fun,
  _context: ExecutionContext,
  printer: SmeupDataStructureWriter
) {

  const users: User[] = await fetchUsers();

  users.forEach(el => {
    printer.writeTreeNode({
      children: [],
      content: {
        tipo: "",
        parametro: "",
        codice: "",
        testo: el.username,
      },
    });

  });




}

export default JsonPlaceholderService;