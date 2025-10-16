const {
  convertTimestampToDate, formatDataForSQL
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe('formatDataForSQL', () => {
  test('should convert table data into array of arrays', () => {
    const data = [
        {
          description: 'The man, the Mitch, the legend',
          slug: 'mitch',
          img_url: ''
        },
        { description: 'Not dogs', slug: 'cats', img_url: '' },
        {
          description: 'what books are made of',
          slug: 'paper',
          img_url: ''
        }
      ]
    const expected = [
        [ 'The man, the Mitch, the legend', 'mitch', ''],
        [ 'Not dogs', 'cats', '' ],
        [ 'what books are made of', 'paper', '']
      ]
    const input = formatDataForSQL(data, ['description', 'slug', 'img_url'])
    expect(input).toEqual(expected)
  });
});

