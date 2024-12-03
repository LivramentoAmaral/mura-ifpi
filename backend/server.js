const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const uuid = require('uuid');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage
});

let images = [];

const loadImagesFromDirectory = () => {
  const directoryPath = path.join(__dirname, 'uploads');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Erro ao ler o diretório 'uploads':", err);
      return;
    }

    images = [];

    files.forEach(file => {
      const filePath = `/uploads/${file}`;
      const image = {
        id: uuid.v4(),
        src: filePath,
        alt: '',
        text: ''
      };
      images.push(image);
    });
  });
};

loadImagesFromDirectory();

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'Nenhum arquivo enviado.'
    });
  }

  const filePath = `/uploads/${req.file.filename}`;
  const newImage = {
    id: uuid.v4(),
    src: filePath,
    alt: req.body.alt || '',
    text: req.body.text || '',
  };

  images.push(newImage);
  return res.status(200).json(newImage);
});

app.get('/images', (req, res) => {
  res.status(200).json(images);
});

app.put('/images/:id', upload.single('image'), async (req, res) => {
  const {
    id
  } = req.params;
  const {
    alt,
    text
  } = req.body;

  const image = images.find((img) => img.id === id);
  if (!image) {
    return res.status(404).json({
      error: 'Imagem não encontrada.'
    });
  }

  if (req.file) {
    const oldFilePath = path.join(__dirname, image.src);

    try {
      await fs.promises.unlink(oldFilePath);

      image.src = `/uploads/${req.file.filename}`;
    } catch (err) {
      console.error('Erro ao apagar o arquivo:', err);
      return res.status(500).json({
        error: 'Erro ao apagar o arquivo antigo.'
      });
    }
  }

  image.alt = alt || image.alt;
  image.text = text || image.text;

  res.status(200).json(image);
});

app.delete('/images/:id', (req, res) => {
  const {
    id
  } = req.params;

  const imageIndex = images.findIndex((img) => img.id === id);
  if (imageIndex === -1) {
    return res.status(404).json({
      error: 'Imagem não encontrada.'
    });
  }

  const [deletedImage] = images.splice(imageIndex, 1);

  const filePath = path.join(__dirname, deletedImage.src);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Erro ao apagar o arquivo:', err);
      return res.status(500).json({
        error: 'Erro ao apagar o arquivo.'
      });
    }

    res.status(200).json({
      message: 'Imagem excluída com sucesso.',
      deletedImage
    });
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});