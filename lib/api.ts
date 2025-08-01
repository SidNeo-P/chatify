// import { supabase } from "./supabase";

// /**
//  * Fetches the raw contacts list for the currently logged-in user.
//  * This only gets the IDs, not the full user details.
//  */
// export async function getContacts() {
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       throw new Error("No authenticated user found");
//     }

//     // Fetches all columns from the 'contacts' table for the current user.
//     // Uses lowercase column names to match the database.
//     const { data: contacts, error } = await supabase
//       .from("contacts")
//       .select("*")
//       .eq("userid", user.id);

//     if (error) {
//       throw error;
//     }

//     return contacts || [];
//   } catch (error) {
//     console.error("Error fetching contacts:", error);
//     throw error;
//   }
// }

// /**
//  * Fetches the full profile of a single user by their ID.
//  * @param {string} userId - The UUID of the user to fetch.
//  */
// export async function getUserById(userId) {
//   if (!userId) return null;

//   try {
//     const { data: userData, error } = await supabase
//       .from("users")
//       .select("*")
//       .eq("userid", userId)
//       .single(); // .single() is efficient for fetching one row

//     if (error) {
//       // It's better to log the error than to throw it,
//       // especially if a contact might point to a deleted user.
//       console.error("Error fetching user:", error.message);
//       return null;
//     }

//     return userData;
//   } catch (error) {
//     console.error("Error in getUserById:", error);
//     throw error;
//   }
// }

// /**
//  * Fetches all messages between the current user and another user.
//  * @param {string} otherUserId - The UUID of the other user in the conversation.
//  */
// export async function getMessages(otherUserId) {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) throw new Error("User not authenticated");

//     const { data, error } = await supabase
//       .from("messages")
//       .select("*")
//       .in("senderid", [user.id, otherUserId])
//       .in("receiverid", [user.id, otherUserId])
//       .order("timestamp", { ascending: true });

//     if (error) {
//       console.error("Error fetching messages:", error);
//       throw error;
//     }
//     return data || [];
//   }

//   /**
//    * Sends a new message from the current user to a receiver.
//    * @param {string} receiverId - The UUID of the user receiving the message.
//    * @param {string} content - The text content of the message.
//    */
//   export async function sendMessage(receiverId, content) {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) throw new Error("User not authenticated");

//     const { data, error } = await supabase
//       .from("messages")
//       .insert({
//         content: content,
//         senderid: user.id,
//         receiverid: receiverId,
//         // status will be set by default by the database if configured
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error("Error sending message:", error);
//       throw error;
//     }
//     return data;
//   }

import { supabase } from "./supabase";

// export async function getContacts() {
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       throw new Error("No authenticated user found");
//     }

//     const { data: contacts, error } = await supabase
//       .from("contacts")
//       .select("*")
//       .eq("userid", user.id);

//     if (error) {
//       throw error;
//     }

//     return contacts || [];
//   } catch (error) {
//     console.error("Error fetching contacts:", error);
//     throw error;
//   }
// }

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
