import styled from 'styled-components';

export const Styles = styled.div`
  display: block;
  max-width: 100%;

  .tableWrap {
    display: block;
    max-width: 100%;
    ${'' /* overflow-x: scroll; */}
    overflow-y: hidden;
    background-color: hsl(var(--card));
  }

  table {
    width: 90vw;
    border-spacing: 0;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 5px solid hsl(var(--border));
      text-align: left;

      width: 1%;
      &.collapse {
        width: 0.0000000001%;
      }

      :nth-child(3) {
        text-align: right;
      }

      :nth-child(4) {
        text-align: left;
        padding-left: 50px;
        max-width: 75px;
      }

      :nth-child(5) {
        text-align: center;
        max-width: 100px;
      }

      :last-child {
        border-right: 0;
        text-align: center;
      }
    }

    th {
      color: hsl(var(--foreground));
    }

    td {
      color: hsl(var(--muted-foreground));
    }
  }

  @media (max-width: 1074px) {
    .noAmount {
      display: none;
    }
  }

  @media (max-width: 966px) {
    .noCurrency {
      display: none;
    }
  }
  @media (max-width: 686px) {
    .noDate {
      display: none;
    }
  }
  @media (max-width: 450px) {
    table {
      th {
        :last-child {
          border-right: 0;
          text-align: right;
        }
      }

      td {
        :last-child {
          border-right: 0;
          text-align: right;
          padding-right: 5%;
        }
      }
    }
  }

  .pagination {
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
`;
