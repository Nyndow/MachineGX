from database import db
from sqlalchemy import text

def id_automa(column_name, table_name, prefix):
    engine = db.get_engine()  
    with engine.connect() as connection:
        query = text(f"SELECT MAX(CAST(SUBSTRING({column_name}, {len(prefix) + 1}) AS UNSIGNED)) AS max_numeric_value FROM {table_name} WHERE {column_name} LIKE :prefix")
        result = connection.execute(query, {'prefix': f'{prefix}%'}).fetchone()

    if result and result.max_numeric_value is not None:
        max_numeric_value = int(result.max_numeric_value)
        max_numeric_value += 1
    else:
        max_numeric_value = 1 

    new_id = f'{prefix}{max_numeric_value}'
    return new_id