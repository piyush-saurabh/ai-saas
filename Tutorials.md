This repo is created based on tutorial https://ui.shadcn.com/docs/installation/next 

## Setup

Ref: https://ui.shadcn.com/docs/installation/next 

**Create the project**

```
npx create-next-app@latest ai-saas --typescript --tailwind --eslint 
```

**Setup the project**
```
npx shadcn-ui@latest init
```

**Run the project**

```
// Runs on locahost:3000
npm run dev
```

### Shadcn Components

**Button**
```
npx shadcn-ui@latest add button
```

## Notes

* Shadcn UI is a CSS framework. All the components (e.g. button) installed using shadcn will be stored in /components folder.

### Folder Structure
* /app will contain all our routes
* /components will have components from shadcn
* /lib/utils.ts will be used to merge tailwind classes