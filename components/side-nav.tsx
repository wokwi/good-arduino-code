import Scrollspy from 'react-scrollspy';

export interface ISideNavLink {
  id: string;
  name: string;
  indent: number;
}

export function SideNav({ links }: { links: ISideNavLink[] }) {
  const ids = links.map((link) => link.id);
  return (
    <>
      <p>Contents</p>
      <Scrollspy
        items={ids}
        currentClassName="active"
        className="nav-list"
        componentTag={({ children }) => <ul>{children}</ul>}
      >
        {links.map((link) => (
          <li key={link.id}>
            <a style={{ paddingLeft: `${5 + link.indent * 16}px` }} href={`#${link.id}`}>
              {link.name}
            </a>
          </li>
        ))}
      </Scrollspy>
      <style jsx>{`
        p {
          color: black;
          font-size: 110%;
          margin: 0 0 8px 0;
          padding-left: 8px;
        }

        ul,
        li {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        li.active {
          font-weight: 600px;
        }

        a {
          display: block;
          font-weight: 400;
          padding: 0 5px;
          margin-top: 3px;
          margin-bottom: 3px;
          text-decoration: none;
          color: #333;
          border-left: 3px solid transparent;
        }

        a:hover {
          border-left-color: #eeeeee;
        }

        li.active a {
          color: black;
          border-left-color: #d0d0d0;
        }
      `}</style>
    </>
  );
}
