-- PetFace · Datos de prueba
-- Usuarios de demo (contraseñas cifradas con bcrypt vía pgcrypto):
--   admin@petface.com   / admin123
--   ana@petface.com     / ana12345
--   carlos@petface.com  / carlos123

INSERT INTO usuarios (nombre, email, password_hash, telefono, rol) VALUES
  ('Administrador', 'admin@petface.com', crypt('admin123', gen_salt('bf', 10)), '+57 300 000 0000', 'admin'),
  ('Ana Rodríguez', 'ana@petface.com',   crypt('ana12345', gen_salt('bf', 10)), '+57 300 111 2233', 'adoptante'),
  ('Carlos Mejía',  'carlos@petface.com', crypt('carlos123', gen_salt('bf', 10)), '+57 310 444 5566', 'adoptante');

-- Las 4 mascotas del proyecto original, con los datos corregidos
INSERT INTO mascotas (nombre, especie, raza, edad_meses, genero, tamano, descripcion, foto_url) VALUES
  ('Paris', 'gato',  'Calico',             36, 'hembra', 'pequeño',
   'Cariñosa y sociable, Paris está lista para llenar tu hogar de amor y alegría. Busca un compañero humano que comparta su afecto y le brinde la seguridad que necesita.',
   '/img/mascotas/paris.jpg'),
  ('Max',   'perro', 'Husky Siberiano',    36, 'macho',  'grande',
   'Juguetón y bien entrenado, Max es el compañero perfecto para hogares activos. Con su naturaleza leal y enérgica, está listo para aventuras al aire libre y momentos de afecto en casa.',
   '/img/mascotas/perro2.jpg'),
  ('Bella', 'perro', 'Golden Retriever',   24, 'hembra', 'grande',
   'Amorosa y obediente, Bella es la compañera ideal para familias. Con su disposición dulce y gentil, ilumina cualquier hogar con amor incondicional y lealtad.',
   '/img/mascotas/perro3.jpg'),
  ('Luna',  'gato',  'Siamés',             48, 'hembra', 'pequeño',
   'Independiente y curiosa, Luna es la gata perfecta para hogares tranquilos. Busca un compañero humano tranquilo que aprecie su naturaleza reservada pero amorosa.',
   '/img/mascotas/gato2.jpg');

INSERT INTO testimonios (autor, texto, aprobado) VALUES
  ('Juan D.',   'Gracias a PetFace, encontré a mi mejor amigo, Rocky. No puedo imaginar mi vida sin él.', TRUE),
  ('Ana R.',    'La adopción fue fácil y el equipo de PetFace nos ayudó en cada paso del camino. Ahora tenemos a Coco, y no podríamos estar más felices.', TRUE),
  ('Carlos M.', 'Adoptamos a Simba hace seis meses, y ha sido una bendición. PetFace realmente se preocupa por sus animales y por encontrarles el hogar adecuado.', TRUE),
  ('Laura G.',  'PetFace hizo que el proceso de adopción fuera sencillo y agradable. Estamos encantados con nuestro nuevo miembro de la familia, Luna.', TRUE),
  ('Sergio T.', 'La dedicación y el amor que PetFace pone en cuidar a los animales es increíble. Adoptar a Toby fue la mejor decisión que pudimos tomar.', TRUE),
  ('Paula S.',  'Gracias a PetFace, pudimos darle a Max un hogar lleno de amor. La adopción fue una experiencia maravillosa.', TRUE),
  ('Diana F.',  'Estamos muy agradecidos con PetFace por ayudarnos a encontrar a nuestro adorable gato, Oliver. Él ha llenado nuestra casa de alegría.', TRUE);

-- ---------------------------------------------------------------
-- Actividad de demo (para que el panel de admin no se vea vacío)
-- ---------------------------------------------------------------

-- Dos personas quieren a Max (pendientes) y Carlos tuvo una solicitud rechazada para Bella
INSERT INTO solicitudes (usuario_id, mascota_id, mensaje, telefono_contacto, estado, creado_en) VALUES
  ((SELECT id FROM usuarios WHERE email = 'ana@petface.com'),    (SELECT id FROM mascotas WHERE nombre = 'Max'),
   'Vivo en una casa con patio grande y salgo a correr todas las mañanas. Max sería el compañero ideal.',
   '+57 300 111 2233', 'pendiente', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM usuarios WHERE email = 'carlos@petface.com'), (SELECT id FROM mascotas WHERE nombre = 'Max'),
   'Tengo experiencia con perros grandes y trabajo desde casa.',
   '+57 310 444 5566', 'pendiente', NOW() - INTERVAL '1 day'),
  ((SELECT id FROM usuarios WHERE email = 'carlos@petface.com'), (SELECT id FROM mascotas WHERE nombre = 'Bella'),
   'Me encantaría adoptarla para mis hijos.',
   '+57 310 444 5566', 'rechazada', NOW() - INTERVAL '10 days');

-- Max tiene solicitudes pendientes → está "en proceso"
UPDATE mascotas SET estado = 'en_proceso' WHERE nombre = 'Max';

INSERT INTO donaciones (usuario_id, nombre, email, monto, creado_en) VALUES
  ((SELECT id FROM usuarios WHERE email = 'ana@petface.com'), 'Ana Rodríguez', 'ana@petface.com', 50000, NOW() - INTERVAL '5 days'),
  (NULL, 'Laura Gómez', 'laura@correo.com', 20000, NOW() - INTERVAL '3 days'),
  (NULL, 'Anónimo',     'donante@correo.com', 100000, NOW() - INTERVAL '1 day');

-- Un testimonio esperando aprobación
INSERT INTO testimonios (usuario_id, autor, texto, aprobado) VALUES
  ((SELECT id FROM usuarios WHERE email = 'carlos@petface.com'), 'Carlos Mejía',
   'Aunque no pude adoptar a Bella, el equipo me orientó muy bien y sigo buscando a mi compañero.', FALSE);
