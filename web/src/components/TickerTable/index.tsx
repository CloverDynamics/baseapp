import React from 'react';
import { useIntl } from 'react-intl';
import { Currency, Market } from '../../modules';
import { Decimal } from '../Decimal';
import { CryptoIcon } from '../CryptoIcon';
import { FIXED_VOL_PRECISION } from "src/constants";

interface Props {
    currentBidUnit: string;
    currentBidUnitsList: string[];
    markets: Market[];
    currencies: Currency[];
    redirectToTrading: (key: string) => void;
    setCurrentBidUnit: (key: string) => void;
}

export const TickerTable: React.FC<Props> = ({
    currentBidUnit,
    currentBidUnitsList,
    markets,
    currencies,
    redirectToTrading,
    setCurrentBidUnit
}) => {
    const { formatMessage } = useIntl();

    const renderItem = React.useCallback(
        (market, index: number) => {
            const marketChangeColor = +(market.change || 0) < 0 ? 'negative' : 'positive';
            const currency = currencies.find(currency => currency.id === market.base_unit)

            return (
                <tr key={index} >
                    <td className="currency">
                        {currency.icon_url ? (
                            <span className="cr-crypto-icon currency__icon">
                                <img alt={currency.name.toUpperCase()} src={currency.icon_url} />
                            </span>
                        ) : (<CryptoIcon className="currency__icon" code={currency.name.toUpperCase()} />)}
                        <div className="currency__names">
                           {market && market.name ?  
                           <span>
                               <span className="currency__names__bold">{market.name.split('/')[0]}</span>
                               <span className="currency__names__light">/{market.name.split('/')[1]}</span>
                            </span> : ""}
                            <span className="currency__names__full-name">{currency.name}</span>
                        </div>
                    </td>
                    <td>
                        <span>
                            <Decimal fixed={market.price_precision} thousSep=",">
                                {market.last}
                            </Decimal>
                        </span>
                    </td>
                    <td>
                        <span>
                            <Decimal fixed={FIXED_VOL_PRECISION} thousSep=",">
                                {market.volume}
                            </Decimal>
                        </span>
                    </td>
                    <td>
                        <span className={`${marketChangeColor} percent__bold`}>{market.price_change_percent}</span>
                    </td>
                    <td>
                    <button onClick={() => redirectToTrading(market.id)} className="landing-button">
                        {formatMessage({ id: 'page.body.marketsTable.button.trade' })}
                    </button>
                    </td>
                </tr>
            );
        },
        [redirectToTrading]
    );

    return (
        <div className="pg-ticker-table">
            <div className="pg-ticker-table__filter">
                <ul className="navigation" role="tablist">
                    {currentBidUnitsList.map((item, i) => (
                        <li
                            key={i}
                            className={`navigation__item ${item === currentBidUnit && 'navigation__item--active'}`}
                            onClick={() => setCurrentBidUnit(item)}>
                            <span className="navigation__item__link">
                                {item ? item.toUpperCase() : formatMessage({ id: 'page.body.marketsTable.filter.all' })}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="pg-ticker-table__table-wrap">
                <table className="pg-ticker-table__table">
                    <thead>
                        <tr>
                            <th scope="col">{formatMessage({ id: 'page.body.marketsTable.header.asset' })}</th>
                            <th scope="col">{formatMessage({ id: 'page.body.marketsTable.header.lastPrice' })}</th>
                            <th scope="col">{formatMessage({ id: 'page.body.marketsTable.header.volume' })}</th>
                            <th scope="col">{formatMessage({ id: 'page.body.marketsTable.header.change' })}</th>
                            <th scope="col"> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {markets[0] ? (
                            markets.map(renderItem)
                        ) : (
                            <tr>
                                <td>
                                    <span className="no-data">{formatMessage({ id: 'page.noDataToShow' })}</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
