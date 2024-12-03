const asana = require('asana');
const AsanaSync = require('../models/asanaSync');
const Task = require('../models/task');

class AsanaController {
  constructor() {
    this.client = null;
  }

  async initializeClient(accessToken) {
    this.client = asana.Client.create().useAccessToken(accessToken);
  }

  async syncTasks(userId) {
    try {
      const asanaSync = await AsanaSync.findOne({ userId });
      if (!asanaSync) throw new Error('Asana sync not configured');

      await this.initializeClient(asanaSync.accessToken);

      // Fetch tasks from Asana
      const tasks = await this.client.tasks.findAll({
        workspace: asanaSync.asanaWorkspaceId,
        assignee: asanaSync.asanaUserId,
        completed_since: asanaSync.lastSync
      });

      // Process and store tasks
      const results = [];
      for await (const task of tasks) {
        const savedTask = await Task.findOneAndUpdate(
          { asanaId: task.gid },
          {
            title: task.name,
            description: task.notes,
            status: task.completed ? 'completed' : 'active',
            dueDate: task.due_on,
            asanaId: task.gid,
            userId
          },
          { upsert: true, new: true }
        );
        results.push(savedTask);
      }

      // Update last sync time
      asanaSync.lastSync = new Date();
      await asanaSync.save();

      return { success: true, message: 'Tasks synchronized successfully', tasks: results };
    } catch (error) {
      console.error('Asana sync error:', error);
      throw error;
    }
  }
}

module.exports = new AsanaController();