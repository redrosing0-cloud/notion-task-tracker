export default async function handler(req, res) {
  // 处理CORS预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tasks, notionToken, databaseId, date } = req.body;

  try {
    // 为每个任务创建Notion页面
    const results = [];
    for (const task of tasks) {
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
          parent: { database_id: databaseId },
          properties: {
            'Task name': {
              title: [
                {
                  text: {
                    content: task.name
                  }
                }
              ]
            },
            'Status': {
              checkbox: task.completed
            },
            'Date': {
              date: {
                start: date
              }
            }
          }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Notion API error: ${error}`);
      }

      results.push(await response.json());
    }

    res.status(200).json({
      success: true,
      message: `成功同步 ${tasks.length} 个任务到Notion`,
      results: results.length
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      error: '同步失败',
      details: error.message
    });
  }
}