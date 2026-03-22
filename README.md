# Gridlio Feed Planner

Gridlio is a visual Instagram feed planner that helps you organize and preview your content before posting.

It allows you to upload, paste, and rearrange images in a simple interface and see how your feed will look across different devices.

## Why I built this

I wanted a simple way to plan an Instagram feed in advance without dealing with daily posting or limitations from existing tools.

Most free tools restrict the number of images you can import, which makes full planning difficult. Gridlio focuses on speed, simplicity, and flexibility.

## Features

- Upload images via file picker or drag and drop  
- Paste images directly from clipboard  
- Drag and drop to reorder posts  
- Live preview of feed layout  
- Mobile, tablet, and desktop mockups  
- Always-visible 3x3 grid structure  
- Persistent per-user workspace  
- Secure authentication  

## Tech Stack

### Frontend
- Qwik  
- Tailwind CSS  
- SortableJS  

### Backend (Supabase)
- Authentication (login, register, logout)  
- Postgres database (`feed_items`)  
- Storage bucket for images  

## How it works

- Images are uploaded to Supabase Storage  
- Metadata (user, image path, order) is stored in Postgres  
- Signed URLs are generated to securely display images  
- Users can reorder images and the order is persisted  
- Each user sees only their own data using Row Level Security  

## Project Structure

```src/
  components/
    auth/
    feed-grid/
    upload-zone/
  lib/
    auth.ts
    feed-items.ts
    storage.ts
    image-utils.ts
    feed-mappers.ts
    supabase.ts
  routes/
    index.tsx 
```

## Getting Started

### Install dependencies

```bash
npm install
```
### Run the app
```bash
npm start
```

## Environment Variables

### Create a .env file:

```bash
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

## Future Improvements

- Instagram integration
- Content scheduling
- Captions/descriptions per image
- Import existing posts from Instagram
- Image cropping and positioning

## Usage

This app is free to use for anyone who wants a simple space to organize their Instagram feed visually.