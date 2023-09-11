from database import db  # Import the db object from your Flask app

def id_automa(column_name, table_name, prefix):
    try:
        max_value = db.session.query(db.func.max(db.cast(db.func.substr(getattr(table_name, column_name), len(prefix) + 1), db.Integer))).scalar()
        if max_value is not None:
            max_value += 1
        else:
            max_value = 1
        return f"{prefix}{max_value}"
    except Exception as e:
        print(e)
        return f"{prefix}{1}"
