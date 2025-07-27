
---

# DRW - Collaborative Whiteboard 

# MIND MAP:

A real-time digital whiteboard for collaborative planning and design with integrated chat functionality.

![App Screenshot](https://github.com/user-attachments/assets/00adcdf6-b2bb-45c3-846f-8bc5eee176a2)



## Todo List

- [ ] Add bcrypt integration  
- [ ] Validate token on frontend  
- [ ] Use cookies for authentication/session management  
- [ ] Add more shapes  
- [ ] Improve chat schema

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Node.js
- **Real-time**: WebSocket
- **Monorepo**: Turborepo

## Project Structure
<img width="673" height="823" alt="image" src="https://github.com/user-attachments/assets/26812702-1654-45aa-bac6-e806daca777f" />



## Development

### Prerequisites
- Node.js
- pnpm

### Setup
```sh
npx create-turbo@latest
pnpm install
```

### Commands
- `pnpm dev`: Start development servers
- `pnpm build`: Build all packages/apps
- `pnpm lint`: Run linter

## Remote Caching

This project supports Turborepo Remote Caching:

```sh
npx turbo login
npx turbo link
```

## Contributing

Contributions are welcome! Please open an issue or PR for any changes.

---

