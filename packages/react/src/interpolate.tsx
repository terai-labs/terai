// Dependencies
import IntlMessageFormat from 'intl-messageformat'

// Types
import { interpolate } from '@rewordlabs/formatter'
import type { ReactNode } from 'react'
import type { InterpolateComponents } from './types'
import type {
  InterpolateOptions,
  InterpolateProps
} from '@rewordlabs/formatter'

export type InterpolateFn = (props: InterpolateProps) => unknown

export const createInterpolate =
  ({
    locale,
    components = {},
    ...rest
  }: {
    locale: string
    components?: InterpolateComponents
  } & InterpolateOptions): InterpolateFn =>
  (props: InterpolateProps) => {
    return interpolate(props, {
      ...rest,
      plugins: [
        message =>
          new IntlMessageFormat(message as string, locale, undefined, {
            ignoreTag: false
          }).format({
            a: (children: ReactNode) => <a>{children}</a>,
            abbr: (children: ReactNode) => <abbr>{children}</abbr>,
            address: (children: ReactNode) => <address>{children}</address>,
            article: (children: ReactNode) => <article>{children}</article>,
            aside: (children: ReactNode) => <aside>{children}</aside>,
            audio: (children: ReactNode) => <audio>{children}</audio>,
            b: (children: ReactNode) => <b>{children}</b>,
            blockquote: (children: ReactNode) => (
              <blockquote>{children}</blockquote>
            ),
            body: (children: ReactNode) => <body>{children}</body>,
            button: (children: ReactNode) => <button>{children}</button>,
            canvas: (children: ReactNode) => <canvas>{children}</canvas>,
            caption: (children: ReactNode) => <caption>{children}</caption>,
            cite: (children: ReactNode) => <cite>{children}</cite>,
            code: (children: ReactNode) => <code>{children}</code>,
            colgroup: (children: ReactNode) => <colgroup>{children}</colgroup>,
            data: (children: ReactNode) => <data>{children}</data>,
            datalist: (children: ReactNode) => <datalist>{children}</datalist>,
            dd: (children: ReactNode) => <dd>{children}</dd>,
            del: (children: ReactNode) => <del>{children}</del>,
            details: (children: ReactNode) => <details>{children}</details>,
            dfn: (children: ReactNode) => <dfn>{children}</dfn>,
            dialog: (children: ReactNode) => <dialog>{children}</dialog>,
            div: (children: ReactNode) => <div>{children}</div>,
            dl: (children: ReactNode) => <dl>{children}</dl>,
            dt: (children: ReactNode) => <dt>{children}</dt>,
            em: (children: ReactNode) => <em>{children}</em>,
            fieldset: (children: ReactNode) => <fieldset>{children}</fieldset>,
            figcaption: (children: ReactNode) => (
              <figcaption>{children}</figcaption>
            ),
            figure: (children: ReactNode) => <figure>{children}</figure>,
            footer: (children: ReactNode) => <footer>{children}</footer>,
            form: (children: ReactNode) => <form>{children}</form>,
            h1: (children: ReactNode) => <h1>{children}</h1>,
            h2: (children: ReactNode) => <h2>{children}</h2>,
            h3: (children: ReactNode) => <h3>{children}</h3>,
            h4: (children: ReactNode) => <h4>{children}</h4>,
            h5: (children: ReactNode) => <h5>{children}</h5>,
            h6: (children: ReactNode) => <h6>{children}</h6>,
            head: (children: ReactNode) => <head>{children}</head>,
            header: (children: ReactNode) => <header>{children}</header>,
            hgroup: (children: ReactNode) => <hgroup>{children}</hgroup>,
            html: (children: ReactNode) => <html>{children}</html>,
            i: (children: ReactNode) => <i>{children}</i>,
            iframe: (children: ReactNode) => <iframe>{children}</iframe>,
            ins: (children: ReactNode) => <ins>{children}</ins>,
            kbd: (children: ReactNode) => <kbd>{children}</kbd>,
            label: (children: ReactNode) => <label>{children}</label>,
            legend: (children: ReactNode) => <legend>{children}</legend>,
            li: (children: ReactNode) => <li>{children}</li>,
            main: (children: ReactNode) => <main>{children}</main>,
            map: (children: ReactNode) => <map>{children}</map>,
            mark: (children: ReactNode) => <mark>{children}</mark>,
            menu: (children: ReactNode) => <menu>{children}</menu>,
            meter: (children: ReactNode) => <meter>{children}</meter>,
            nav: (children: ReactNode) => <nav>{children}</nav>,
            noscript: (children: ReactNode) => <noscript>{children}</noscript>,
            object: (children: ReactNode) => <object>{children}</object>,
            ol: (children: ReactNode) => <ol>{children}</ol>,
            optgroup: (children: ReactNode) => <optgroup>{children}</optgroup>,
            option: (children: ReactNode) => <option>{children}</option>,
            output: (children: ReactNode) => <output>{children}</output>,
            p: (children: ReactNode) => <p>{children}</p>,
            pre: (children: ReactNode) => <pre>{children}</pre>,
            progress: (children: ReactNode) => <progress>{children}</progress>,
            q: (children: ReactNode) => <q>{children}</q>,
            rp: (children: ReactNode) => <rp>{children}</rp>,
            rt: (children: ReactNode) => <rt>{children}</rt>,
            ruby: (children: ReactNode) => <ruby>{children}</ruby>,
            s: (children: ReactNode) => <s>{children}</s>,
            samp: (children: ReactNode) => <samp>{children}</samp>,
            section: (children: ReactNode) => <section>{children}</section>,
            select: (children: ReactNode) => <select>{children}</select>,
            small: (children: ReactNode) => <small>{children}</small>,
            span: (children: ReactNode) => <span>{children}</span>,
            strong: (children: ReactNode) => <strong>{children}</strong>,
            sub: (children: ReactNode) => <sub>{children}</sub>,
            summary: (children: ReactNode) => <summary>{children}</summary>,
            sup: (children: ReactNode) => <sup>{children}</sup>,
            table: (children: ReactNode) => <table>{children}</table>,
            tbody: (children: ReactNode) => <tbody>{children}</tbody>,
            td: (children: ReactNode) => <td>{children}</td>,
            tfoot: (children: ReactNode) => <tfoot>{children}</tfoot>,
            th: (children: ReactNode) => <th>{children}</th>,
            thead: (children: ReactNode) => <thead>{children}</thead>,
            time: (children: ReactNode) => <time>{children}</time>,
            tr: (children: ReactNode) => <tr>{children}</tr>,
            u: (children: ReactNode) => <u>{children}</u>,
            ul: (children: ReactNode) => <ul>{children}</ul>,
            var: (children: ReactNode) => <var>{children}</var>,
            video: (children: ReactNode) => <video>{children}</video>,
            area: () => <area />,
            base: () => <base />,
            br: () => <br />,
            col: () => <col />,
            embed: () => <embed />,
            hr: () => <hr />,
            img: () => <img />,
            input: () => <input />,
            link: () => <link />,
            meta: () => <meta />,
            source: () => <source />,
            track: () => <track />,
            wbr: () => <wbr />,
            ...components
          })
      ]
    })
  }
