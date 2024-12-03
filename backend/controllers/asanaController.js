const asana = require('asana');
const AsanaSync = require('../models/asanaSync');
const Task = require('../models/task');

// Initialize Asana client
const client = asana.Client.create({
  clientId: process.env.ASANA_CLIENT_ID,
  clientSecret: process.env.ASANA_CLIENT_SECRET,
  redirectUri: process.env.ASANA_REDIRECT_URI
});

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const asanaSync = await AsanaSync.findOne({ userId: req.user._id });
    if (!asanaSync) {
      return res.status(404).json({ message: 'Asana not connected' });
    }

    // Get tasks from both local DB and Asana
    const [localTasks, asanaTasks] = await Promise.all([
      Task.find({ userId: req.user._id }),
      client.tasks.findAll({
        workspace: asanaSync.asanaWorkspaceId,
        assignee: asanaSync.asanaUserId,
        completed_since: 'now'
      })
    ]);

    res.json({
      local: localTasks,
      asana: asanaTasks.data
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Complete a task
const completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update local task
    task.status = 'completed';
    await task.save();

    // Update Asana task if linked
    if (task.asanaId) {
      const asanaSync = await AsanaSync.findOne({ userId: req.user._id });
      if (asanaSync) {
        await client.tasks.update(task.asanaId, {
          completed: true
        });
      }
    }

    res.json(task);
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Handle Asana webhook
const handleWebhook = async (req, res) => {
  try {
    const { events } = req.body;
    
    for (const event of events) {
      if (event.type === 'task' && event.action === 'changed') {
        await Task.findOneAndUpdate(
          { asanaId: event.resource.gid },
          { status: event.resource.completed ? 'completed' : 'active' }
        );
      }
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Connect Asana account
const connectAsana = async (req, res) => {
  try {
    const { code } = req.body;
    
    // Exchange code for token
    const tokenData = await client.app.accessTokenFromCode(code);
    
    // Get user info
    client.useOauth({ credentials: tokenData });
    const user = await client.users.me();
    
    // Get workspace
    const workspaces = await client.workspaces.findAll();
    const workspace = workspaces.data[0]; // Using first workspace
    
    // Save or update Asana connection
    await AsanaSync.findOneAndUpdate(
      { userId: req.user._id },
      {
        accessToken: tokenData.access_token,
        asanaUserId: user.gid,
        asanaWorkspaceId: workspace.gid
      },
      { upsert: true }
    );
    
    res.json({ message: 'Asana connected successfully' });
  } catch (error) {
    console.error('Connect Asana error:', error);
    res.status(500).json({ message: 'Failed to connect Asana' });
  }
};

module.exports = {
  getTasks,
  completeTask,
  handleWebhook,
  connectAsana
};