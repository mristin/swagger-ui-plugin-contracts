// Based on: https://raw.githubusercontent.com/chilts/umd-template/master/template.js
((f) => {
  // module name and requires
  const name = "ContractsPlugin";
  const requires = [];

  // CommonJS
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f.apply(
      null,
      requires.map(function (r) {
        return require(r);
      })
    );

    // RequireJS
    // eslint-disable-next-line no-undef
  } else if (typeof define === "function" && define.amd) {
    // eslint-disable-next-line no-undef
    define(requires, f);

    // <script>
  } else {
    let g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      // works providing we're not in "use strict";
      // needed for Java 8 Nashorn
      // see https://github.com/facebook/react/issues/3037
      g = this;
    }
    g[name] = f.apply(
      null,
      requires.map(function (r) {
        return g[r];
      })
    );
  }
})(() => {
  const hasProp = (obj, prop) =>
    Object.prototype.hasOwnProperty.call(obj, prop);

  const renderCode = (text, language, { React }) => {
    return language !== undefined && language !== null
      ? React.createElement(
          "pre",
          { className: "microlight", style: { position: "relative" } },
          [
            text,
            React.createElement(
              "span",
              {
                style: {
                  color: "red",
                  position: "absolute",
                  right: "5px",
                  top: "5px",
                  textAlign: "right",
                },
              },
              language
            ),
          ]
        )
      : React.createElement("pre", { className: "microlight" }, text);
  };

  const renderConditions = (conditions, { React }) => {
    const items = [];

    for (const condition of conditions) {
      const item = [];

      if (hasProp(condition, "description")) {
        item.push(React.createElement("p", null, condition.description));
      }

      if (hasProp(condition, "text")) {
        const language = hasProp(condition, "language")
          ? condition.language
          : null;
        item.push(renderCode(condition.text, language, { React }));
      }

      if (hasProp(condition, "enforced") && hasProp(condition, "statusCode")) {
        if (condition.enforced) {
          item.push(
            React.createElement(
              "p",
              null,
              `Status code: ${condition.statusCode}`
            )
          );
        } else {
          item.push(React.createElement("p", null, "Not enforced!"));
        }
      } else if (
        !hasProp(condition, "enforced") &&
        hasProp(condition, "statusCode")
      ) {
        // This is an ambiguous case, as we actually do not know whether the condition is
        // enforced or not, but we handle it in order to make the plugin robust.
        item.push(
          React.createElement("p", null, `Status code: ${condition.statusCode}`)
        );
        item.push(React.createElement("p", null, "Maybe enforced, maybe not!"));
      } else if (
        hasProp(condition, "enforced") &&
        !hasProp(condition, "statusCode")
      ) {
        item.push(
          React.createElement(
            "p",
            null,
            condition.enforced ? "Enforced" : "Not enforced"
          )
        );
      } else {
        // Neither enforced nor status code are specified.
        // There is nothing we can show in this case.
      }

      if (hasProp(condition, "language")) {
        item.push(
          React.createElement(
            "p",
            {
              style: {
                position: "absolute",
                top: 0,
                right: 0,
                textAlign: "right",
              },
            },
            condition.language
          )
        );
      }

      items.push(React.createElement("li", null, item));
    }

    return React.createElement("ul", null, items);
  };

  const renderSnapshots = (snapshots, { React }) => {
    const items = [];

    for (const snapshot of snapshots) {
      const item = [];

      if (hasProp(snapshot, "text") && hasProp(snapshot, "name")) {
        const statement = `OLD.${snapshot.name} = ${snapshot.text}`;
        const language = hasProp(snapshot, "language")
          ? snapshot.language
          : null;

        item.push(renderCode(statement, language, { React }));
      } else if (!hasProp(snapshot, "text") && hasProp(snapshot, "name")) {
        item.push(
          React.createElement(
            "p",
            { style: { color: "red" } },
            `The text of the snapshot ${JSON.stringify(
              snapshot.name
            )} has not been specified.`
          )
        );
      } else if (hasProp(snapshot, "text") && !hasProp(snapshot, "name")) {
        item.push(
          React.createElement(
            "p",
            { style: { color: "red" } },
            `The name of the snapshot with text ${JSON.stringify(
              snapshot.text
            )} has not been specified.`
          )
        );
      } else {
        // Neither the text nor the name were specified.
        // We can only ignore this snapshot.
        continue;
      }

      if (!hasProp(snapshot, "enabled")) {
        item.push(React.createElement("p", null, "Maybe enabled, maybe not!"));
      } else if (!snapshot.enabled) {
        item.push(React.createElement("p", null, "Disabled!"));
      } else {
        // Don't display anything particular if the snapshot is enabled.
      }

      items.push(React.createElement("li", null, item));
    }

    return React.createElement("ul", null, items);
  };

  const renderXContracts = (contracts, { React }) => {
    const { preconditions, snapshots, postconditions } = contracts;

    if (
      preconditions.Length === 0 &&
      snapshots.Length === 0 &&
      postconditions.Length === 0
    ) {
      return React.createElement("p", null, "No contracts specified");
    }

    const body = [];

    if (preconditions.length > 0) {
      const title =
        preconditions.length === 1 ? "Pre-condition" : "Pre-conditions";
      body.push(React.createElement("h4", null, title));
      body.push(renderConditions(preconditions, { React }));
    }

    if (snapshots.length > 0) {
      const title = snapshots.length === 1 ? "Snapshot" : "Snapshots";
      body.push(React.createElement("h4", null, title));
      body.push(renderSnapshots(snapshots, { React }));
    }

    if (postconditions.length > 0) {
      const title =
        postconditions.length === 1 ? "Post-condition" : "Post-conditions";
      body.push(React.createElement("h4", null, title));
      body.push(renderConditions(postconditions, { React }));
    }

    return React.createElement("div", null, body);
  };

  const MyOperationExtRow = (Original, { React }) => (props) => {
    const { xKey, xVal } = props;

    if (xKey === "x-contracts") {
      const contracts = !xVal ? null : xVal.toJS ? xVal.toJS() : xVal;

      return React.createElement("tr", null, [
        React.createElement("td", null, "Contracts"),
        React.createElement("td", null, renderXContracts(contracts, { React })),
      ]);
    } else {
      return React.createElement(Original, props);
    }
  };

  // Module source
  return (system) => {
    return {
      wrapComponents: {
        OperationExtRow: MyOperationExtRow,
      },
    };
  };
});
