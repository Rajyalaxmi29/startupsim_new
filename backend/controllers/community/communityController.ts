import { Request, Response } from 'express';

// Mock Data
let posts = [
  {
    id: '1',
    username: 'Sarah_Founder',
    role: 'Founder',
    content: 'Just closed our seed round! It was a grueling 6 months of pitching, but we finally found the right partners who believe in our mission to democratize clean energy.',
    timestamp: '2 hours ago',
    likes: 24,
    comments: [
      { id: 'c1', username: 'Dev_Mike', role: 'Developer', content: 'Huge congrats, Sarah! The mission is inspiring.' },
      { id: 'c2', username: 'Investor_Joe', role: 'Investor', content: 'Well deserved. Looking forward to seeing the execution.' }
    ]
  },
  {
    id: '2',
    username: 'Alex_Dev',
    role: 'Developer',
    content: 'Struggling with our MVP architecture. Should we go with a monolith for speed or microservices for future scalability? We are building a high-traffic fintech app.',
    timestamp: '5 hours ago',
    likes: 12,
    comments: [
      { id: 'c3', username: 'Tech_Lead_Sam', role: 'Developer', content: 'Monolith first. Premature optimization is the root of all evil. Scale when you actually have the traffic.' }
    ]
  },
  {
    id: '3',
    username: 'Learner_Priya',
    role: 'Learner',
    content: 'How do you guys handle the initial hiring? Finding the first 5 employees who are as passionate as the founders seems impossible.',
    timestamp: '1 day ago',
    likes: 45,
    comments: [
      { id: 'c4', username: 'Hiring_Guru', role: 'Founder', content: 'Look for missionaries, not mercenaries. Your first hires should be people who would start this company if you didn\'t.' }
    ]
  }
];

export const getPosts = (req: Request, res: Response) => {
  res.json(posts);
};

export const createPost = (req: Request, res: Response) => {
  const { username, role, content } = req.body;
  const newPost = {
    id: String(posts.length + 1),
    username: username || 'Anonymous',
    role: role || 'Learner',
    content,
    timestamp: 'Just now',
    likes: 0,
    comments: []
  };
  posts = [newPost, ...posts];
  res.status(201).json(newPost);
};

export const getComments = (req: Request, res: Response) => {
  const { id } = req.params;
  const post = posts.find(p => p.id === id);
  if (post) {
    res.json(post.comments);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
};

export const createComment = (req: Request, res: Response) => {
  const { postId, username, role, content } = req.body;
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex !== -1) {
    const newComment = {
      id: `c${Date.now()}`,
      username: username || 'Anonymous',
      role: role || 'Learner',
      content
    };
    posts[postIndex].comments.push(newComment);
    res.status(201).json(newComment);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
};
