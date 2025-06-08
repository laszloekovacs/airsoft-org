-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION update_search_vector() RETURNS trigger 
AS $$
BEGIN 
NEW.search_vector := setweight(
    to_tsvector('hungarian', COALESCE(NEW.title, '')),
    'A'
) || setweight(
    to_tsvector('hungarian', COALESCE(NEW.description, '')),
    'B'
) || setweight(
    to_tsvector(
        'hungarian',
        array_to_string(COALESCE(NEW.tags, '{}'), ' ')
    ),
    'C'
);

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tsvectorupdate 
BEFORE INSERT OR UPDATE 
ON event_record 
FOR EACH ROW 
EXECUTE FUNCTION update_search_vector();