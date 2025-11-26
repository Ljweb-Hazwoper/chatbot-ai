# Use an official Node.js runtime as a parent image
FROM node:22

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Accept build arguments
ARG VITE_PORT
ARG VITE_API_URL

# Set environment variables
ENV VITE_PORT=${VITE_PORT}
ENV VITE_API_URL=${VITE_API_URL}
ENV PORT=${VITE_PORT}

# Set the working directory in the container
WORKDIR /lms_react_admin

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the app
RUN pnpm build

# Install serve globally to serve static files
RUN pnpm add -g serve

# Expose the port the app runs on
EXPOSE ${VITE_PORT}

# Serve compiled static files
CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
