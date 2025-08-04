import { supabase } from "./supabase";
import * as Contacts from "expo-contacts";
import { Session } from "@supabase/supabase-js";
export async function getContacts() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user found");
    }

    const { data: contacts, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("userid", user.id);

    if (error) {
      throw error;
    }

    // ✅ Map field names to match your TS Contact type
    return (
      contacts?.map((c) => ({
        ContactID: c.contactid,
        UserID: c.userid,
        ContactUserID: c.contactuserid,
        Nickname: c.nickname,
        Blocked: c.blocked,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
}
export async function getUserById(userId: string) {
  console.log("Fetching user by ID:", userId);
  if (!userId) return null;
  try {
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("userid", userId)
      .maybeSingle(); // Handles zero/one row safely

    if (error) {
      throw error;
    }

    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function sendMessage(receiverId: string, content: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user found");
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        content: content,
        senderid: user.id,
        receiverid: receiverId,
        timestamp: new Date().toISOString(),
        status: "sent",
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function getMessages(otherUserId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("Messages")
    .select("*")
    .in("SenderID", [user.id, otherUserId])
    .in("ReceiverID", [user.id, otherUserId])
    .order("Timestamp", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
  return data || [];
}

// lib/contacts.ts

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
