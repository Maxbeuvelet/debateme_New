import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Delete all user-related data
    try {
      // Delete user stances
      const stances = await base44.asServiceRole.entities.UserStance.filter({ user_id: userId });
      await Promise.all(stances.map(s => base44.asServiceRole.entities.UserStance.delete(s.id).catch(() => {})));

      // Delete private notes
      const notes = await base44.asServiceRole.entities.PrivateNote.filter({ created_by: user.email });
      await Promise.all(notes.map(n => base44.asServiceRole.entities.PrivateNote.delete(n.id).catch(() => {})));

      // Delete public messages
      const messages = await base44.asServiceRole.entities.PublicMessage.filter({ sender_name: user.username });
      await Promise.all(messages.map(m => base44.asServiceRole.entities.PublicMessage.delete(m.id).catch(() => {})));

      // Delete user-created debates
      const debates = await base44.asServiceRole.entities.Debate.filter({ created_by: user.email });
      await Promise.all(debates.map(d => base44.asServiceRole.entities.Debate.delete(d.id).catch(() => {})));

      // Finally, delete the user account
      await base44.asServiceRole.entities.User.delete(userId);

      return Response.json({ success: true });
    } catch (error) {
      console.error("Error deleting user data:", error);
      return Response.json({ error: "Failed to delete account data" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in deleteAccount:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});