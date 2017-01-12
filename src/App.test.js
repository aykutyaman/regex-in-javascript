import chai from 'chai';
const { expect } = chai;

const output = (str, regex) => {
  return str.replace(regex, selected => `<b>${selected}</b>`);
};

describe('Introduction', () => {
  it('find pattern', () => {
    const str = 'Is this This?';
    const regex = /is/gi;
    const expected = '<b>Is</b> th<b>is</b> Th<b>is</b>?';
    expect(output(str, regex)).to.be.equal(expected);
  });
});

describe('Find plain text patterns', () => {
  it('find all the strings that have a character followed by at', () => {
    const str = 'Cat sat on the hat.';
    const regex = /.at/gi;
    const expected = '<b>Cat</b> <b>sat</b> on the <b>hat</b>.';
    expect(output(str, regex)).to.be.equal(expected);
  });
  it('find seven characters', () => {
    const str = `Cat
sat on
the hat.`;
    // dot identifies any character including letters, digits and
    // a dash but not a line break
    const regex = /......./g;
    const expected = 'Cat\nsat on\n<b>the hat</b>.';
    expect(output(str, regex)).to.be.equal(expected);
  });
  it('find special character dot', () => {
    const str = 'Cat sat on the hat.';
    const regex = /\./g;
    const expected = 'Cat sat on the hat<b>.</b>';
    expect(output(str, regex)).to.be.equal(expected);
  });
});

describe('Find repeated patterns', () => {
  it('find five a with curly brackets', () => {
    const str = 'aaaaaaa';
    const regex = /a{5}/g;
    const expected = '<b>aaaaa</b>aa';
    expect(output(str, regex)).to.be.equal(expected);
  });
  it('find at least and up to', () => {
    const str = 'aaaaaaa';
    const regex = /a{5,6}/g; // at least 5, up to 6 characters
    const expected = '<b>aaaaaa</b>a';
    expect(output(str, regex)).to.be.equal(expected);
  });
  it('find either http or https', () => {
    const str = `http://egghead.io
not a web address
http://
https://www.egghead.io`;
    const regex = /https?:\/\/.+/g; // at least 5, up to 6 characters
    const expected = `<b>http://egghead.io</b>
not a web address
http://
<b>https://www.egghead.io</b>`;
    expect(output(str, regex)).to.be.equal(expected);
  });
});

describe('Find sets of characters', () => {
  it('find included chars', () => {
    const str = 'cat mat bat Hat ?at 0at';
    const regex = /[bc]at/g;
    const expected = '<b>cat</b> mat <b>bat</b> Hat ?at 0at';
    expect(output(str, regex)).to.be.equal(expected);
  });
  it('find negated chars', () => {
    const str = 'cat mat bat Hat ?at 0at';
    const regex = /[^bc]at/g;
    const expected = 'cat <b>mat</b> bat <b>Hat</b> <b>?at</b> <b>0at</b>';
    expect(output(str, regex)).to.be.equal(expected);
  });
  it('find based on ranges', () => {
    const str = 'cat mat bat Hat ?at 0at';
    const regex = /[a-zA-Z]at/g;
    const expected = '<b>cat</b> <b>mat</b> <b>bat</b> <b>Hat</b> ?at 0at';
    expect(output(str, regex)).to.be.equal(expected);
  });
  it('find based on negated ranges', () => {
    const str = 'cat mat bat Hat ?at 0at';
    const regex = /[^a-zA-Z]at/g;
    const expected = 'cat mat bat Hat <b>?at</b> <b>0at</b>';
    expect(output(str, regex)).to.be.equal(expected);
  });
  it('find special chars in ranges', () => {
    const str = 'cat mat bat Hat ?at 0at';
    const regex = /[a-zA-Z0-9?]at/g;
    const expected = '<b>cat</b> <b>mat</b> <b>bat</b> <b>Hat</b> <b>?at</b> <b>0at</b>';
    expect(output(str, regex)).to.be.equal(expected);
  });
});

describe('Use shorthand to find common sets of characters', () => {
  it('find whitespace negation shorthand', () => {
    const str = 'Au $1 5.5%';
    const regex = /[\S]/g;
    const expected = '<b>A</b><b>u</b> <b>$</b><b>1</b> <b>5</b><b>.</b><b>5</b><b>%</b>';
    expect(output(str, regex)).to.be.equal(expected);
  });
});

describe('Find Groups of Characters', () => {
  it('area code with groups', () => {
    const str = `800-456-7890
(555) 456-7890
4564567890`;
    const regex = /\(?(\d{3})\)?[\s-]?\d{3}[\s-]?\d{4}/g;
    const expected = `<b>800</b>
<b>555</b>
<b>456</b>`;
    const output = str.replace(regex, (selected, group) => `<b>${group}</b>`);

    expect(output).to.be.equal(expected);
  });
});

describe('Find a String that Precedes Another String', () => {
  it('find foo not followed by bar or boo', () => {
    var str = 'foo foobar foobaz fooboo';
    const regex = /foo(?!bar|boo)/g;
    const expected = '<b>foo</b> foobar <b>foo</b>baz fooboo';
    expect(output(str, regex)).to.be.equal(expected);
  });
});

describe('Find the Start and End of Whole Words', () => {
  it('find with boundary', () => {
    var str = 'This history is his, it is';
    const regex = /\Bis\B/g;
    const expected = 'This h<b>is</b>tory is his, it is';
    expect(output(str, regex)).to.be.equal(expected);
  });
});


describe('Match the Same String Twice', () => {
  it('replace tags', () => {
    const str = '<b>Bold</b><i>italics</i>';
    const regex = /<(\w+)>(.*)<\/\1>/g;
    const expected = `Bold
italics
`;
    const output =  str.replace(regex, '$2\n');
    expect(output).to.be.equal(expected);
  });
});

describe('Match the Start and End of a Line', () => {
  it('find', () => {
    const str = `12/1/16
12-16-13
11/12/16
12-12-2016`;
    const regex = /^12.+16$/gm;
    const expected = `<b>12/1/16</b>
12-16-13
11/12/16
<b>12-12-2016</b>`;

    expect(output(str, regex)).to.be.equal(expected);
  });
});
