// import * as Contacts from "expo-contacts";
// import { supabase } from "./supabase"; // adjust the path if needed
// import { Session } from "@supabase/supabase-js";

// export async function getDeviceContacts() {
//   const { status } = await Contacts.requestPermissionsAsync();

//   if (status !== "granted") {
//     throw new Error("Permission to access contacts was denied");
//   }

//   const { data } = await Contacts.getContactsAsync({
//     fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
//   });

//   // Optional: Filter out contacts without phone numbers
//   return data.filter((contact) => contact.phoneNumbers?.length);
// }

// export async function uploadContactsToSupabase(
//   contacts: Contacts.Contact[],
//   session: Session
// ) {
//   const userID = session.user.id;

//   const contactEntries = contacts.map((contact) => ({
//     UserID: userID,
//     ContactUserID: null, // Optional: Try to match from Supabase Users table
//     Nickname: contact.name,
//     Blocked: false,
//   }));

//   const { error } = await supabase.from("Contacts").insert(contactEntries);
//   if (error) {
//     throw new Error(error.message);
//   }
// }

// lib/contacts.ts
import * as Contacts from "expo-contacts";
import { supabase } from "./supabase"; // adjust the path if needed
import { Session } from "@supabase/supabase-js";

export async function getDeviceContacts() {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== "granted")
    throw new Error("Permission to access contacts denied");

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
  });

  return data.filter(
    (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
  );
}
// lib/contacts.ts
export async function uploadContactsToSupabase(
  contacts: any[],
  session: Session
) {
  const formatted = contacts.map((c) => ({
    UserID: session.user.id,
    ContactID: c.id,
    Nickname: c.name,
    PhoneNumber: c.phoneNumbers[0].number,
    Blocked: false,
  }));

  const { error } = await supabase.from("Contacts").upsert(formatted);

  if (error) throw error;
}
