
export const sample_rooms: any[] = [
  {
    id: '1',
    name: 'Pokój 2-osobowy',
    price: 250,
    rooms: 3,
    beds: 3,
    imageUrl: 'assets/house-1.png',
    type: 'Pokój',
    maxGuests: 5,
    desc: 'opis testowy',
    desc_long: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tag: ['Klimatyzacja', 'Telewizor', 'WI-FI']
  },
  {
    id: '2',
    name: 'Dom 6-osobowy',
    price: 300,
    beds:4,
    rooms: 4,
    type: 'Apartament',
    imageUrl: 'assets/house-2.jpg',
    maxGuests: 6,
    desc: 'opis testowy',
    desc_long: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tag: ['Klimatyzacja', 'Telewizor', 'WI-FI']
  },
  {
    id: '3',
    name: 'Domek 4-osobowy',
    price: 200,
    beds: 5,
    type: 'apartament',
    rooms: 2,
    imageUrl: 'assets/house-3.jpg',
    maxGuests: 4,
    desc: 'rem Ipsum',
    desc_long: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tag: ['Klimatyzacja', 'Telewizor', 'WI-FI']
  },
  {
    id: '4',
    name: 'Domek 8-osobowy',
    beds:7,
    type:'Domek',
    price: 400,
    rooms: 5,
    imageUrl: 'assets/house-4.jpg',
    maxGuests: 8,
    desc: 'opis testowy',
    desc_long: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tag: ['Klimatyzacja', 'Telewizor', 'WI-FI']
  }
]

export const sample_users:any[] = [
  {name:"John Doe",
  email: "john@gmail.com",
  password: "12345",
  address: "Toronto on",
  isAdmin: true
  },
  {name:"Jane Doe",
  email: "jane@gmail.com",
  password: "12345",
  address: "Warsow",
  isAdmin: false
  }
]

export const sample_tags:any[] = [
  {name: 'Wszystkie'},
  {name: 'Telewizor', count: 0},
  {name: 'Klimatyzacja', count: 0},
  {name: 'WI-FI',  count: 0},
  {name: 'Balkon', count: 0},
  {name: 'Kuchnia', count: 0},
  {name: 'Pralka', count: 0},
  {name:'Parking', count: 0},
  {name: 'Przyjazne dla zwierząt', count: 0}
]
