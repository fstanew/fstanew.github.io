import sqlite3
from flask import Flask, render_template, request, url_for, flash, redirect

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sekretny_klucz_lab_j'

def get_db_connection():
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    conn = get_db_connection()
    cars = conn.execute('SELECT * FROM car').fetchall()
    conn.close()
    return render_template('index.html', cars=cars)

@app.route('/car/<int:id>')
def show(id):
    conn = get_db_connection()
    car = conn.execute('SELECT * FROM car WHERE id = ?', (id,)).fetchone()
    conn.close()
    if car is None:
        return "Nie znaleziono auta", 404
    return render_template('show.html', car=car)

@app.route('/car/new', methods=('GET', 'POST'))
def create():
    if request.method == 'POST':
        brand = request.form['brand']
        model = request.form['model']
        conn = get_db_connection()
        conn.execute('INSERT INTO car (brand, model) VALUES (?, ?)', (brand, model))
        conn.commit()
        conn.close()
        return redirect(url_for('index'))
    return render_template('create.html')

@app.route('/car/<int:id>/edit', methods=('GET', 'POST'))
def edit(id):
    conn = get_db_connection()
    car = conn.execute('SELECT * FROM car WHERE id = ?', (id,)).fetchone()
    if request.method == 'POST':
        brand = request.form['brand']
        model = request.form['model']
        conn.execute('UPDATE car SET brand = ?, model = ? WHERE id = ?', (brand, model, id))
        conn.commit()
        conn.close()
        return redirect(url_for('index'))
    conn.close()
    return render_template('edit.html', car=car)

@app.route('/car/<int:id>/delete', methods=('POST',))
def delete(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM car WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(port=57846, debug=True)
