import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify the caller is authenticated and is admin
    const currentUser = await base44.auth.me();
    if (!currentUser || currentUser.role !== 'admin') {
      return Response.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    // Get all users with pagination
    let allUsers = [];
    let skip = 0;
    const pageSize = 100;
    
    while (true) {
      const batch = await base44.asServiceRole.entities.User.list('-created_date', pageSize, skip);
      if (!batch || batch.length === 0) break;
      allUsers = allUsers.concat(batch);
      if (batch.length < pageSize) break;
      skip += pageSize;
    }

    // Create CSV content
    const csvHeader = 'Email,Username,Full Name,Level,XP,Debates Joined,Created Date\n';
    const csvRows = allUsers.map(user => {
      const email = user.email || '';
      const username = user.username || '';
      const fullName = user.full_name || '';
      const level = user.level || 1;
      const xp = user.xp || 0;
      const debatesJoined = user.debates_joined || 0;
      const createdDate = user.created_date || '';
      
      // Escape fields that might contain commas
      const escapeField = (field) => {
        const str = String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };
      
      return `${escapeField(email)},${escapeField(username)},${escapeField(fullName)},${level},${xp},${debatesJoined},${escapeField(createdDate)}`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=debateme_users.csv'
      }
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});