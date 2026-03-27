# Gridlio Feed Planner 0.2

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

## Vercel Edge

This starter site is configured to deploy to [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions), which means it will be rendered at an edge location near to your users.

## Installation

The adaptor will add a new `vite.config.ts` within the `adapters/` directory, and a new entry file will be created, such as:

```
└── adapters/
    └── vercel-edge/
        └── vite.config.ts
└── src/
    └── entry.vercel-edge.tsx
```

Additionally, within the `package.json`, the `build.server` script will be updated with the Vercel Edge build.

## Production build

To build the application for production, use the `build` command, this command will automatically run `npm run build.server` and `npm run build.client`:

```shell
npm run build
```

[Read the full guide here](https://github.com/QwikDev/qwik/blob/main/starters/adapters/vercel-edge/README.md)

## Dev deploy

To deploy the application for development:

```shell
npm run deploy
```

Notice that you might need a [Vercel account](https://docs.Vercel.com/get-started/) in order to complete this step!

## Production deploy

The project is ready to be deployed to Vercel. However, you will need to create a git repository and push the code to it.

You can [deploy your site to Vercel](https://vercel.com/docs/concepts/deployments/overview) either via a Git provider integration or through the Vercel CLI.
