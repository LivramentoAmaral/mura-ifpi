Aqui está o `README.md` atualizado, unindo os dois estilos e ajustado para o backend descrito:

---

# Getting Started with Node.js Upload Backend

This project is a simple backend for managing file uploads, built with Node.js, Express, Multer, and UUID.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the server in development mode.\
Open [http://localhost:5000](http://localhost:5000) to interact with the API.

The server will reload if you make changes to the source code (with a tool like `nodemon`).\
You may also see runtime errors in the console.

---

## Project Structure

```plaintext
.
├── backend/          # Project root directory.
│   ├── uploads/      # Directory where uploaded files are stored.
│   ├── .gitignore    # Git ignore configuration.
│   ├── package-lock.json  # Dependency lock file.
│   ├── package.json  # Project metadata and dependencies.
│   └── server.js     # Main server file managing uploads.
```

---

## API Endpoints

### **1. Upload an Image**
- **POST /upload**  
  **Description:** Uploads a new image.  
  **Request Body:**  
  - Form-data with the field `image` containing the file.  
  - Optional fields:  
    - `alt`: Alt text for the image.  
    - `text`: Additional descriptive text.

  **Example Response:**
  ```json
  {
    "id": "unique-image-id",
    "src": "/uploads/image-name.ext",
    "alt": "Image alt text",
    "text": "Image descriptive text"
  }
  ```

---

### **2. Get All Images**
- **GET /images**  
  **Description:** Retrieves a list of all uploaded images.

  **Example Response:**
  ```json
  [
    {
      "id": "unique-image-id",
      "src": "/uploads/image-name.ext",
      "alt": "Image alt text",
      "text": "Image descriptive text"
    }
  ]
  ```

---

### **3. Update an Image**
- **PUT /images/:id**  
  **Description:** Updates an existing image by ID.  
  **Request Parameters:**  
  - `:id`: ID of the image to update.  
  **Request Body:**  
  - Optional fields:  
    - `image` (new file in form-data).  
    - `alt`: Updated alt text.  
    - `text`: Updated descriptive text.

  **Example Response:**
  ```json
  {
    "id": "unique-image-id",
    "src": "/uploads/new-image-name.ext",
    "alt": "Updated alt text",
    "text": "Updated descriptive text"
  }
  ```

---

### **4. Delete an Image**
- **DELETE /images/:id**  
  **Description:** Deletes an image by ID.  
  **Request Parameters:**  
  - `:id`: ID of the image to delete.

  **Example Response:**
  ```json
  {
    "message": "Imagem excluída com sucesso.",
    "deletedImage": {
      "id": "unique-image-id",
      "src": "/uploads/image-name.ext",
      "alt": "Alt text",
      "text": "Descriptive text"
    }
  }
  ```

---

### **5. Serve Uploaded Images**
- **GET /uploads/:filename**  
  **Description:** Serves the uploaded image files.  
  **Request Parameters:**  
  - `:filename`: Name of the file to retrieve.  
  **Example URL:**  
  [http://localhost:5000/uploads/example-image.jpg](http://localhost:5000/uploads/example-image.jpg)

---

## Customization

You can customize the application using environment variables. Create a `.env` file in the root directory and configure the following options:

- `PORT`: The port where the server runs (default: 5000).  
- `UPLOAD_DIR`: The directory where files are uploaded (default: `uploads`).

---

## Learn More

- To learn more about [Node.js](https://nodejs.org/).
- To learn more about [Express.js](https://expressjs.com/).
- To learn more about [Multer](https://github.com/expressjs/multer).
- To learn more about [UUID](https://github.com/uuidjs/uuid).

---

This project is a foundational setup and can be extended to include features like authentication, file validation, and cloud storage integration.

---