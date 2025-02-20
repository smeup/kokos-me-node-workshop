export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
  }
  export interface Image {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}
  
  export interface Geo {
    lat: string;
    lng: string;
  }
  
  export interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
  }
  
  export default interface UserT {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
  }
  