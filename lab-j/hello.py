import sys

imie = "Filip"
album = "57846"
wersja = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
sciezka = sys.executable

print(f"Hello {imie} ({album}). This environment is using Python version {wersja} at location {sciezka}.")