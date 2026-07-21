"""Genera variantes WebP de entrega; los originales y la procedencia no se modifican."""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SOURCES = {
    "concept-restaurante": ASSETS / "concept-restaurante.webp",
    "concept-taller": ASSETS / "concept-taller.webp",
    "concept-evento": ASSETS / "concept-evento.webp",
    "concept-arquitectura": ASSETS / "concept-arquitectura.webp",
    "barber-letrero-clasico": ASSETS / "barber" / "ChatGPT Image 20 jul 2026, 12_39_17 (1).png",
    "barber-llavero": ASSETS / "barber" / "ChatGPT Image 20 jul 2026, 12_39_17 (2).png",
    "barber-figura": ASSETS / "barber" / "ChatGPT Image 20 jul 2026, 12_39_17 (3).png",
    "barber-display": ASSETS / "barber" / "ChatGPT Image 20 jul 2026, 12_39_17 (4).png",
    "transporte-display-ruta": ASSETS / "transporte" / "ChatGPT Image 20 jul 2026, 12_49_46 (1).png",
    "transporte-llavero": ASSETS / "transporte" / "ChatGPT Image 20 jul 2026, 12_49_46 (2).png",
    "transporte-figura": ASSETS / "transporte" / "ChatGPT Image 20 jul 2026, 12_49_47 (3).png",
    "transporte-emblema": ASSETS / "transporte" / "ChatGPT Image 20 jul 2026, 12_49_47 (4).png",
    "pizzeria-llavero": ASSETS / "pizzeria" / "ChatGPT Image 20 jul 2026, 12_43_30 (2).png",
    "pizzeria-letrero": ASSETS / "pizzeria" / "ChatGPT Image 20 jul 2026, 12_43_30 (1).png",
    "pizzeria-figura": ASSETS / "pizzeria" / "ChatGPT Image 20 jul 2026, 12_43_31 (3).png",
    "pizzeria-display": ASSETS / "pizzeria" / "ChatGPT Image 20 jul 2026, 12_43_31 (4).png",
    "hamburgueseria-figura": ASSETS / "hamburgueseria" / "ChatGPT Image 20 jul 2026, 14_02_36 (3).png",
    "hamburgueseria-letrero": ASSETS / "hamburgueseria" / "ChatGPT Image 20 jul 2026, 14_02_36 (1).png",
    "hamburgueseria-llavero": ASSETS / "hamburgueseria" / "ChatGPT Image 20 jul 2026, 14_02_36 (2).png",
    "hamburgueseria-display": ASSETS / "hamburgueseria" / "ChatGPT Image 20 jul 2026, 14_02_36 (4).png",
    "dentista-llavero": ASSETS / "dentista" / "ChatGPT Image 20 jul 2026, 14_13_15 (2).png",
    "dentista-placa-clinica": ASSETS / "dentista" / "ChatGPT Image 20 jul 2026, 14_13_15 (1).png",
    "dentista-figura": ASSETS / "dentista" / "ChatGPT Image 20 jul 2026, 14_13_15 (3).png",
    "dentista-letrero": ASSETS / "dentista" / "ChatGPT Image 20 jul 2026, 14_13_15 (4).png",
    "hotel-display-informativo": ASSETS / "hotel" / "ChatGPT Image 20 jul 2026, 15_23_23 (3).png",
    "hotel-placa-habitacion": ASSETS / "hotel" / "ChatGPT Image 20 jul 2026, 15_23_22 (1).png",
    "hotel-organizador-recepcion": ASSETS / "hotel" / "ChatGPT Image 20 jul 2026, 15_23_23 (2).png",
    "hotel-colgante-puerta": ASSETS / "hotel" / "ChatGPT Image 20 jul 2026, 15_23_23 (4).png",
    "boda-figura-novios": ASSETS / "boda" / "ChatGPT Image 20 jul 2026, 15_33_43.png",
    "boda-letrero-bienvenida": ASSETS / "boda" / "ChatGPT Image 20 jul 2026, 15_33_51 (1).png",
    "boda-adorno-pastel": ASSETS / "boda" / "ChatGPT Image 20 jul 2026, 15_33_51 (2).png",
    "boda-numero-mesa": ASSETS / "boda" / "ChatGPT Image 20 jul 2026, 15_33_52 (4).png",
    "escuela-identificador-lapiz": ASSETS / "escuela" / "ChatGPT Image 20 jul 2026, 15_47_54 (1).png",
    "escuela-llavero": ASSETS / "escuela" / "ChatGPT Image 20 jul 2026, 15_47_55 (2).png",
    "escuela-organizador": ASSETS / "escuela" / "ChatGPT Image 20 jul 2026, 15_47_55 (3).png",
    "escuela-separador": ASSETS / "escuela" / "ChatGPT Image 20 jul 2026, 15_47_55 (4).png",
    "gym-trofeo-coach": ASSETS / "gym" / "ChatGPT Image 20 jul 2026, 18_10_04 (1).png",
    "gym-llavero": ASSETS / "gym" / "ChatGPT Image 20 jul 2026, 18_10_04 (2).png",
    "gym-figura-coach": ASSETS / "gym" / "ChatGPT Image 20 jul 2026, 18_10_06 (3).png",
    "gym-letrero-power": ASSETS / "gym" / "ChatGPT Image 20 jul 2026, 18_10_06 (4).png",
    "seccion-idea": ASSETS / "lading" / "seccion_idea_01.png",
}

for name, source in SOURCES.items():
    output_directory = source.parent if source.suffix.lower() == ".png" else ASSETS
    with Image.open(source) as image:
        image = image.convert("RGB")
        widths = (480, 768, 960) if source.suffix.lower() == ".png" else (480, 768)
        for width in widths:
            height = round(image.height * width / image.width)
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
            suffix = "" if width == 960 else f"-{width}"
            destination = output_directory / f"{name}{suffix}.webp"
            resized.save(destination, "WEBP", quality=78, method=6, exif=b"")
            print(f"{destination.relative_to(ROOT)} {width}x{height} {destination.stat().st_size} bytes")
